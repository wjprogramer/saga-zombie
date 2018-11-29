from PTTLibrary.Information import PostInformation
from PTTLibrary.Information import PushInformation
import sqlite3


class SQLiteDBHandler:
    def __init__(self, path):
        self.__path = path

    def __create_tables(self):
        # enables foreign key constraint support
        self.__conn.execute('PROGMA foreign_key = ON;')
        # table `boards`
        self.__conn.execute('''
CREATE TABLE IF NOT EXISTS `boards`
(
    `id` INTEGER PRIMARY KEY AUTOINCREMENT,
    `name` TEXT UNIQUE NOT NULL
);''')
        # table `users`
        self.__conn.execute('''
CREATE TABLE IF NOT EXISTS `users`
(
    `id` INTEGER PRIMARY KEY AUTOINCREMENT,
    `username` TEXT UNIQUE NOT NULL
);''')
        # table `posts`
        self.__conn.execute('''
CREATE TABLE IF NOT EXISTS `post`
(
    `id` INTEGER PRIMARY KEY AUTOINCREMENT,
    `board` INTEGER NOT NULL,
    `index` INTEGER NOT NULL,
    `post_id` TEXT UNIQUE NOT NULL,
    `author` INTEGER NOT NULL,
    `date_time` INTEGER NOT NULL,
    `title` TEXT NOT NULL,
    `money` INTEGER NOT NULL,
    `ip` TEXT NOT NULL,
    `delete_state` INTEGER NOT NULL,
    `list_date` TEXT NOT NULL,
    FOREIGN KEY (board) REFERENCES board(id),
    FOREIGN KEY (author) REFERENCES users(id)
);''')
        # table `post_content`
        self.__conn.execute('''
CREATE TABLE IF NOT EXISTS `post_content`
(
    `id` INTEGER PRIMARY KEY AUTOINCREMENT,
    `post` INTEGER UNIQUE NOT NULL,
    `content` TEXT NOT NULL,
    FOREIGN KEY (post) REFERENCES posts(id)
);''')
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
        # table `crawled_posts`
        self.__conn.execute('''
CREATE TABLE IF NOT EXISTS `crawled_posts`
(
    `id` INTEGER PRIMARY KEY AUTOINCREMENT,
    `post` INTEGER UNIQUE NOT NULL,
    `date_time` NOT NULL,
    FOREIGN KEY (post) REFERENCES posts(id)
);''')

    def __enter__(self):
        self.__conn = sqlite3.connect(self.__path)
        self.__create_tables()
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        self.__conn.commit()
        self.__conn.close()
