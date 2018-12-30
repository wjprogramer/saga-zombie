"""
SQLite handler module
"""

from threading import Lock
from threading import Thread
from time import sleep
import sqlite3

from utils import get_push_ip_time
from utils import get_post_year
from utils import get_post_time
from utils import get_current_time
from utils import get_post_author_id


class SQLiteDBHandler:
    def __init__(self, path, backup=None, backup_period=0, max_op_count: int = 10000):
        self.__path = path
        self.__conn = None
        self.__max_op_count = max_op_count
        self.__op_count = 0
        self.__execution_lock = Lock()
        self.__counter_lock = Lock()
        self.__commitment_lock = Lock()
        self.__post_insertion_lock = Lock()
        self.__db_opening = False
        self.__backup = backup
        self.__backup_period = backup_period

    def query(self, query: str, *args, **kwargs):
        return self.__execute_read(query, *args, **kwargs)

    def get_page_range_last_crawled(self, board, beginning_page, ending_page):
        return self.__execute_read('''
SELECT COALESCE (
    (
        SELECT `date_time` FROM `crawled_page_range`
        WHERE `board` = (
            SELECT `id` FROM `boards`
            WHERE `name` = :board
        ) and `beginning_page` = :beginning_page and `ending_page` = :ending_page
    ), 0
);
            ''',
            {
                'board': board,
                'beginning_page': beginning_page,
                'ending_page': ending_page
            })[0][0]

    def set_page_range_crawled(self, board, beginning_page, ending_page):
        self.__execute_write('''
INSERT OR REPLACE INTO `crawled_page_range`
(`id`, `board`, `beginning_page`, `ending_page`, `date_time`)
VALUES
(
    (
        SELECT `id` FROM `crawled_page_range`
        WHERE `board` = (
            SELECT `id` FROM `boards`
            WHERE `name` = :board
        ) AND
        `beginning_page` = :beginning_page AND
        `ending_page` = :ending_page
    ),
    (
        SELECT `id` FROM `boards`
        WHERE `name` = :board
    ),
    :beginning_page,
    :ending_page,
    :date_time
);
            ''',
            {
                'board': board,
                'beginning_page': beginning_page,
                'ending_page': ending_page,
                'date_time': get_current_time()
            })

    def add_user(self, user: str):
        self.__execute_write('''
INSERT OR REPLACE INTO `users`
(`id`, `username`)
VALUES
(
    (
        SELECT `id` FROM `users`
        WHERE `username` = :user
    ),
    :user
);''', {'user': user})

    def add_board(self, board: str):
        self.__execute_write('''
INSERT OR REPLACE INTO `boards`
(`id`, `name`)
VALUES
(
    (
        SELECT `id` FROM `boards`
        WHERE `name` = :board
    ),
    :board
);''', {'board': board})

    def insert_or_update_post(self, post):
        if post is None:
            return

        author = get_post_author_id(post['author'])
        board = post['board']
        post_time = get_post_time(post['date'])
        title = post['article_title']
        ip = post['ip']
        messages = post['messages']
        post_id = post['article_id']
        content = post['content']
        url = post['url']

        self.add_user(author)
        self.add_board(board)

        with self.__post_insertion_lock:
            self.__execute_write('''
INSERT OR REPLACE INTO `posts`
(
    `id`,
    `board`,
    `post_id`,
    `author`,
    `date_time`,
    `title`,
    `web_url`,
    `ip`
)
VALUES
(
    (
        SELECT `id` FROM `posts`
        WHERE `board` = (
            SELECT `id` FROM `boards`
            WHERE `name` = :board
        ) AND `post_id` = :post_id
    ),
    (
        SELECT `id` FROM `boards`
        WHERE `name` = :board
    ),
    :post_id,
    (
        SELECT `id` FROM `users`
        WHERE `username` = :author
    ),
    :date_time,
    :title,
    :web_url,
    :ip
);
                ''',
                {
                    'board': board,
                    'post_id': post_id,
                    'author': author,
                    'date_time': post_time,
                    'title': title,
                    'web_url': url,
                    'ip': ip
                }
            )

            self.__execute_write('''
INSERT OR REPLACE INTO `posts_content`
(`id`, `post`, `content`)
VALUES
(
    (
        SELECT `id` FROM `posts_content`
        WHERE `post` = (
            SELECT `id` FROM `posts`
            WHERE `board` = (
                SELECT `id` FROM `boards`
                WHERE `name` = :board
            ) AND `post_id` = :post_id
        )
    ),
    (
        SELECT `id` FROM `posts`
        WHERE `board` = (
            SELECT `id` FROM `boards`
            WHERE `name` = :board
        ) AND `post_id` = :post_id
    ),
    :content
);
                ''',
                {
                    'board': board,
                    'post_id': post_id,
                    'content': content
                }
            )

            # delete existing pushes
            self.__execute_write('''
DELETE FROM `pushes`
WHERE `post` = (
    SELECT `id` FROM `posts`
    WHERE `board` = (
        SELECT `id` FROM `boards`
        WHERE `name` = :board
    ) AND `post_id` = :post_id
);
                ''',
                {
                    'board': board,
                    'post_id': post_id
                }
            )

            year = get_post_year(post['date'])
            if year == 0:
                return
            for push in messages:
                author = push['push_userid']
                push_content = push['push_content']
                push_tag = push['push_tag']
                ip, push_time = get_push_ip_time(year, push['push_ipdatetime'])
                if push_time < post_time:
                    _, push_time = get_push_ip_time(year + 1, push['push_ipdatetime'])
                
                self.add_user(author)
                self.__execute_write('''
INSERT INTO `pushes`
(
    `post`,
    `type`,
    `author`,
    `content`,
    `ip`,
    `date_time`
)
VALUES
(
    (
        SELECT `id` FROM `posts`
        WHERE `board` = (
            SELECT `id` FROM `boards`
            WHERE `name` = :board
        ) AND `post_id` = :post_id
    ),
    :type ,
    (
        SELECT `id` FROM `users`
        WHERE `username` = :author
    ),
    :content ,
    :ip ,
    :date_time
)
                    ''',
                    {
                        'board': board,
                        'post_id': post_id,
                        'type': push_tag,
                        'author': author,
                        'content': push_content,
                        'ip': ip,
                        'date_time': push_time
                    }
                )

            self.__execute_write('''
INSERT OR REPLACE INTO `crawled_posts`
(`id`, `post`, `date_time`)
VALUES
(
    (
        SELECT `id` FROM `crawled_posts`
        WHERE `post` = (
            SELECT `id` FROM `posts`
            WHERE `board` = (
                SELECT `id` FROM `boards`
                WHERE `name` = :board
            ) AND `post_id` = :post_id
        )
    ),
    (
        SELECT `id` FROM `posts`
        WHERE `board` = (
            SELECT `id` FROM `boards`
            WHERE `name` = :board
        ) AND `post_id` = :post_id
    ),
    :date_time
);
                ''',
                {
                    'board': board,
                    'post_id': post_id,
                    'date_time': get_current_time()
                }
            )

    def __execute_read(self, *args, **kwargs):
        with self.__execution_lock:
            return self.__conn.execute(*args, **kwargs).fetchall()

    def __execute_write(self, *args, **kwargs):
        with self.__execution_lock:
            self.__conn.execute(*args, **kwargs)
            self.__op_count_increment()

    def __op_count_increment(self):
        with self.__counter_lock:
            self.__op_count += 1
            if self.__op_count >= self.__max_op_count:
                self.__commit_now()
                self.__op_count = 0

    def __commit_now(self):
        with self.__commitment_lock:
            self.__conn.commit()

    def __create_tables(self):
        # table `boards`
        self.__conn.execute('''
CREATE TABLE IF NOT EXISTS `boards`
(
    `id` INTEGER PRIMARY KEY AUTOINCREMENT,
    `name` TEXT UNIQUE NOT NULL
);''')
        self.__conn.execute('''
CREATE UNIQUE INDEX IF NOT EXISTS
`index_boards_id` ON `boards`(`id`);''')
        self.__conn.execute('''
CREATE UNIQUE INDEX IF NOT EXISTS
`index_boards_name` ON `boards`(`name`);''')

        # table `users`
        self.__conn.execute('''
CREATE TABLE IF NOT EXISTS `users`
(
    `id` INTEGER PRIMARY KEY AUTOINCREMENT,
    `username` TEXT UNIQUE NOT NULL
);''')
        self.__conn.execute('''
CREATE UNIQUE INDEX IF NOT EXISTS
`index_users_id` ON `users`(`id`);''')
        self.__conn.execute('''
CREATE UNIQUE INDEX IF NOT EXISTS
`index_users_username` ON `users`(`username`);''')

        # table `posts`
        self.__conn.execute('''
CREATE TABLE IF NOT EXISTS `posts`
(
    `id` INTEGER PRIMARY KEY AUTOINCREMENT,
    `board` INTEGER NOT NULL,
    `post_id` TEXT NOT NULL,
    `author` INTEGER NOT NULL,
    `date_time` INTEGER,
    `title` TEXT,
    `web_url` TEXT,
    `ip` TEXT,
    UNIQUE(`board`, `post_id`),
    FOREIGN KEY (board) REFERENCES board(id),
    FOREIGN KEY (author) REFERENCES users(id)
);''')
        self.__conn.execute('''
CREATE UNIQUE INDEX IF NOT EXISTS
`index_posts_id` ON `posts`(`id`);''')
        self.__conn.execute('''
CREATE UNIQUE INDEX IF NOT EXISTS
`index_posts_post_id` ON `posts`(`post_id`);''')
        self.__conn.execute('''
CREATE INDEX IF NOT EXISTS
`index_posts_author` ON `posts`(`author`);''')
        self.__conn.execute('''
CREATE INDEX IF NOT EXISTS
`index_posts_date_time` ON `posts`(`date_time`);''')
        self.__conn.execute('''
CREATE INDEX IF NOT EXISTS
`index_posts_ip` ON `posts`(`ip`);''')

        # table `post_content`
        self.__conn.execute('''
CREATE TABLE IF NOT EXISTS `posts_content`
(
    `id` INTEGER PRIMARY KEY AUTOINCREMENT,
    `post` INTEGER UNIQUE NOT NULL,
    `content` TEXT NOT NULL,
    FOREIGN KEY (post) REFERENCES posts(id)
);''')
        self.__conn.execute('''
CREATE UNIQUE INDEX IF NOT EXISTS
`index_posts_content_id` ON `posts_content`(`id`);''')
        self.__conn.execute('''
CREATE UNIQUE INDEX IF NOT EXISTS
`index_posts_content_post` ON `posts_content`(`post`);''')

        # table `pushes`
        self.__conn.execute('''
CREATE TABLE IF NOT EXISTS `pushes`
(
    `id` INTEGER PRIMARY KEY AUTOINCREMENT,
    `post` INTEGER NOT NULL,
    `type` TEXT NOT NULL,
    `author` INTEGER NOT NULL,
    `content` TEXT NOT NULL,
    `ip` TEXT,
    `date_time` INTEGER NOT NULL
);''')
        self.__conn.execute('''
CREATE INDEX IF NOT EXISTS
`index_pushes_id` ON `pushes`(`id`);''')
        self.__conn.execute('''
CREATE INDEX IF NOT EXISTS
`index_pushes_post` ON `pushes`(`post`);''')
        self.__conn.execute('''
CREATE INDEX IF NOT EXISTS
`index_pushes_type` ON `pushes`(`type`);''')
        self.__conn.execute('''
CREATE INDEX IF NOT EXISTS
`index_pushes_author` ON `pushes`(`author`);''')
        self.__conn.execute('''
CREATE INDEX IF NOT EXISTS
`index_pushes_ip` ON `pushes`(`ip`);''')
        self.__conn.execute('''
CREATE INDEX IF NOT EXISTS
`index_pushes_date_time` ON `pushes`(`date_time`);''')

        # table `crawled_posts`
        self.__conn.execute('''
CREATE TABLE IF NOT EXISTS `crawled_posts`
(
    `id` INTEGER PRIMARY KEY AUTOINCREMENT,
    `post` INTEGER UNIQUE NOT NULL,
    `date_time` NOT NULL,
    FOREIGN KEY (`post`) REFERENCES `posts`(`id`)
);''')
        self.__conn.execute('''
CREATE UNIQUE INDEX IF NOT EXISTS
`index_crawled_posts_id` ON `crawled_posts`(`id`);''')
        self.__conn.execute('''
CREATE UNIQUE INDEX IF NOT EXISTS
`index_crawled_posts_post` ON `crawled_posts`(`post`);''')
        self.__conn.execute('''
CREATE INDEX IF NOT EXISTS
`index_crawled_posts_date_time` ON `crawled_posts`(`date_time`);''')

        # table `crawled_page_range`
        self.__conn.execute('''
CREATE TABLE IF NOT EXISTS `crawled_page_range`
(
    `id` INTEGER PRIMARY KEY AUTOINCREMENT,
    `board` INTEGER NOT NULL,
    `beginning_page` INTEGER NOT NULL,
    `ending_page` INTEGER NOT NULL,
    `date_time` NOT NULL,
    UNIQUE (`board`, `beginning_page`, `ending_page`) ON CONFLICT REPLACE,
    FOREIGN KEY (`board`) REFERENCES `posts`(`id`)
);''')
        self.__conn.execute('''
CREATE UNIQUE INDEX IF NOT EXISTS
`index_crawled_page_range_id` ON `crawled_page_range`(`id`);''')
        self.__conn.execute('''
CREATE INDEX IF NOT EXISTS
`index_crawled_page_range_board` ON `crawled_page_range`(`board`);''')
        self.__conn.execute('''
CREATE INDEX IF NOT EXISTS
`index_crawled_page_range_beginning_page` ON `crawled_page_range`(`beginning_page`);''')
        self.__conn.execute('''
CREATE INDEX IF NOT EXISTS
`index_crawled_page_range_ending_page` ON `crawled_page_range`(`ending_page`);''')
        self.__conn.execute('''
CREATE INDEX IF NOT EXISTS
`index_crawled_page_range_date_time` ON `crawled_page_range`(`date_time`);''')

    def connected(self) -> bool:
        return self.__enter__() is not None

    def close(self):
        if self.__db_opening:
            self.__exit__()

    def __backup_routine(self):
        if self.__backup_period > 0:
            while True:
                if not self.__db_opening:
                    break
                with sqlite3.connect(self.__backup) as backup:
                    self.__conn.backup(backup)
                sleep(self.__backup_period)

    def __enter__(self):
        with self.__execution_lock:
            if not self.__db_opening:
                self.__conn = sqlite3.connect(self.__path, check_same_thread=False)
                self.__db_opening = True
                # enables foreign key constraint support
                self.__conn.execute('PRAGMA foreign_key = ON;')
                self.__create_tables()
                if self.__backup is not None:
                    Thread(target=self.__backup_routine).start()
                return self

    def __exit__(self, *args):
        with self.__execution_lock:
            if self.__db_opening:
                self.__commit_now()
                self.__conn.close()
                self.__db_opening = False
