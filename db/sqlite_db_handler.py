"""
SQLite handler module
"""

from threading import Lock
import sqlite3

from PTTLibrary.Information import PostInformation

from utils import get_push_time
from utils import get_post_year
from utils import get_post_time
from utils import get_current_time
from utils import get_post_author_id


class SQLiteDBHandler:
    def __init__(self, path, max_op_count: int = 10000):
        self.__path = path
        self.__conn = None
        self.__max_op_count = max_op_count
        self.__op_count = 0
        self.__execution_lock = Lock()
        self.__counter_lock = Lock()
        self.__commitment_lock = Lock()
        self.__post_insertion_lock = Lock()
        self.__db_opening = False

    def query(self, query: str):
        return self.__execute_read(query)

    def get_boards(self):
        return self.__execute_read('SELECT * FROM `boards`;')

    def get_users(self):
        return self.__execute_read('SELECT * FROM `users`;')

    def get_posts(self, after: int=0):
        if after == 0:
            return self.__execute_read('SELECT * FROM `posts`;')
        return self.__execute_read(
            'SELECT * FROM `posts` WHERE `date_time` >= :after ;',
            {'after': after})

    def get_pushes(self, after: int=0):
        if after == 0:
            return self.__execute_read('SELECT * FROM `pushes`;')
        return self.__execute_read(
            'SELECT * FROM `pushes` WHERE `date_time` >= :after ;',
            {'after': after})

    def get_board_id(self, board: str) -> int:
        return self.__execute_read(
            'SELECT `id` FROM `boards` WHERE `name` = :board ;',
            {'name': board}
        )

    def get_user_id(self, username: str) -> int:
        return self.__execute_read(
            'SELECT `id` FROM `users` WHERE `username` = :username ;',
            {'username': username}
        )

    def get_post(self, post_id):
        return self.__execute_read(
            'SELECT * FROM `posts` WHERE `post_id` = :post_id ;',
            {'post_id': post_id}
        )

    def get_post_pushes(self, post_id):
        return self.__execute_read('''
SELECT * FROM `pushes` WHERE `post` = (
    SELECT `id` FROM `posts` WHERE `post_id` = :post_id
);
        ''', {'post_id': post_id})

    def get_posts_by_user_id(self, user_id: int, after: int = 0):
        if after == 0:
            return self.__execute_read(
                'SELECT * FROM `posts` WHERE `author` = :user_id ;',
                {'user_id': user_id}
            )
        return self.__execute_read(
            'SELECT * FROM `posts` WHERE `author` = :user_id AND `date_time` >= :after ;',
            {'user_id': user_id, 'after': after}
        )

    def get_posts_by_username(self, username: str, after: int = 0):
        if after == 0:
            return self.__execute_read('''
SELECT * FROM `posts`
WHERE `author` = (
    SELECT `id` FROM `users`
    WHERE `username` = :username
);''', {'username': username})
        return self.__execute_read('''
SELECT * FROM `posts`
WHERE `author` = (
    SELECT `id` FROM `users`
    WHERE `username` = :username
) AND `date_time` >= :after ;''', {'username': username, 'after': after})

    def get_posts_by_ip(self, ip: str):
        return self.__execute_read('SELECT * FROM `posts` WHERE `ip` = :ip ;', {'ip': ip})

    def get_pushes_by_user_id(self, user_id: int, after: int = 0):
        if after == 0:
            return self.__execute_read(
                'SELECT * FROM `pushes` WHERE `author` = :user_id ;',
                {'user_id': user_id}
            )
        return self.__execute_read(
            'SELECT * FROM `pushes` WHERE `author` = :user_id AND `date_time` > :after ;',
            {'user_id': user_id, 'after': after}
        )

    def get_pushes_by_username(self, username: str, after: int=0):
        if after == 0:
            return self.__execute_read('''
SELECT * FROM `pushes`
WHERE `author` = (
    SELECT `id` FROM `users`
    WHERE `username` = :username
);''', {'username': username})
        return self.__execute_read('''
SELECT * FROM `pushes`
WHERE `author` = (
    SELECT `id` FROM `users`
    WHERE `username` = :username
) AND `date_time` >= :after ;''', {'username': username, 'after': after})

    def get_pushes_by_ip(self, ip: str):
        return self.__execute_read('SELECT * FROM `pushes` WHERE `ip` = :ip ;', {'ip': ip})

    def get_time_range_last_crawled(self, board, time_begin, time_end):
        return self.__execute_read('''
SELECT COALESCE (
    (
        SELECT `date_time` FROM `crawled_time_range`
        WHERE `board` = (
            SELECT `id` FROM `boards`
            WHERE `name` = :board
        ) and `time_begin` = :time_begin and `time_end` = :time_end
    ), 0
);
            ''',
            {
                'board': board,
                'time_begin': time_begin,
                'time_end': time_end
            })[0][0]

    def set_time_range_crawled(self, board, time_begin, time_end):
        self.__execute_write('''
INSERT OR REPLACE INTO `crawled_time_range`
(`id`, `board`, `time_begin`, `time_end`, `date_time`)
VALUES
(
    (
        SELECT `id` FROM `crawled_time_range`
        WHERE `board` = (
            SELECT `id` FROM `boards`
            WHERE `name` = :board
        ) AND
        `time_begin` = :time_begin AND
        `time_end` = :time_end
    ),
    (
        SELECT `id` FROM `boards`
        WHERE `name` = :board
    ),
    :time_begin,
    :time_end,
    :date_time
);
            ''',
            {
                'board': board,
                'time_begin': time_begin,
                'time_end': time_end,
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

    def insert_or_update_post(self, post: PostInformation):
        if post is None:
            return

        author = get_post_author_id(post)
        board = post.getBoard()
        delete_status = post.getDeleteStatus()
        self.add_user(author)
        self.add_board(board)

        if delete_status == 0:
            with self.__post_insertion_lock:
                post_id = post.getID()

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
    `money`,
    `ip`
)
VALUES
(
    (
        SELECT `id` FROM `posts`
        WHERE `post_id` = :post_id
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
    :money,
    :ip
);
                    ''',
                    {
                        'board': board,
                        'post_id': post_id,
                        'author': author,
                        'date_time': get_post_time(post),
                        'title': post.getTitle(),
                        'web_url': post.getWebUrl(),
                        'money': post.getMoney(),
                        'ip': post.getIP()
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
            WHERE `post_id` = :post_id
        )
    ),
    (
        SELECT `id` FROM `posts`
        WHERE `post_id` = :post_id
    ),
    :content
);
                    ''',
                    {
                        'post_id': post_id,
                        'content': post.getContent()
                    }
                )

                # delete existing pushes
                self.__execute_write('''
DELETE FROM `pushes`
WHERE `post` = (
    SELECT `id` FROM `posts`
    WHERE `post_id` = :post_id
);
                    ''', {'post_id': post_id})

                year = get_post_year(post)
                for push in post.getPushList():
                    author = push.getAuthor()
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
        WHERE `post_id` = :post_id
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
                        'post_id': post_id,
                        'type': push.getType(),
                        'author': push.getAuthor(),
                        'content': push.getContent(),
                        'ip': push.getIP(),
                        'date_time': get_push_time(year, push)
                    })

                self.__execute_write('''
INSERT OR REPLACE INTO `crawled_posts`
(`id`, `post`, `date_time`)
VALUES
(
    (
        SELECT `id` FROM `crawled_posts`
        WHERE `post` = (
            SELECT `id` FROM `posts`
            WHERE `post_id` = :post_id
        )
    ),
    (
        SELECT `id` FROM `posts`
        WHERE `post_id` = :post_id
    ),
    :date_time
);
                ''',
                {
                    'post_id': post_id,
                    'date_time': get_current_time()
                })

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
    `post_id` TEXT UNIQUE NOT NULL,
    `author` INTEGER NOT NULL,
    `date_time` INTEGER,
    `title` TEXT,
    `web_url` TEXT,
    `money` INTEGER,
    `ip` TEXT,
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
    `type` INTEGER NOT NULL,
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

        # table `crawled_time_range`
        self.__conn.execute('''
CREATE TABLE IF NOT EXISTS `crawled_time_range`
(
    `id` INTEGER PRIMARY KEY AUTOINCREMENT,
    `board` INTEGER NOT NULL,
    `time_begin` INTEGER NOT NULL,
    `time_end` INTEGER NOT NULL,
    `date_time` NOT NULL,
    UNIQUE (`board`, `time_begin`, `time_end`) ON CONFLICT REPLACE,
    FOREIGN KEY (`board`) REFERENCES `posts`(`id`)
);''')
        self.__conn.execute('''
CREATE UNIQUE INDEX IF NOT EXISTS
`index_crawled_time_range_id` ON `crawled_time_range`(`id`);''')
        self.__conn.execute('''
CREATE INDEX IF NOT EXISTS
`index_crawled_time_range_board` ON `crawled_time_range`(`board`);''')
        self.__conn.execute('''
CREATE INDEX IF NOT EXISTS
`index_crawled_time_range_time_begin` ON `crawled_time_range`(`time_begin`);''')
        self.__conn.execute('''
CREATE INDEX IF NOT EXISTS
`index_crawled_time_range_time_end` ON `crawled_time_range`(`time_end`);''')
        self.__conn.execute('''
CREATE INDEX IF NOT EXISTS
`index_crawled_time_range_date_time` ON `crawled_time_range`(`date_time`);''')

    def connected(self) -> bool:
        return self.__enter__() is not None

    def close(self):
        if self.__db_opening:
            self.__exit__()

    def __enter__(self):
        with self.__execution_lock:
            if not self.__db_opening:
                self.__conn = sqlite3.connect(self.__path, check_same_thread=False)
                self.__db_opening = True
                # enables foreign key constraint support
                self.__conn.execute('PRAGMA foreign_key = ON;')
                self.__create_tables()
                return self

    def __exit__(self, *args):
        with self.__execution_lock:
            if self.__db_opening:
                self.__commit_now()
                self.__conn.close()
                self.__db_opening = False
