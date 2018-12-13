"""
crawler module
"""

import time
import threading

from PTTLibrary import PTT
from utils import eprint
from utils import get_post_time
from utils import get_current_time

from crawler_.configs import Config
from crawler_.configs import ConfigTimeRange

class Crawler:
    """Crawler class
    """

    SUCCESS_OR_DELETED = (PTT.ErrorCode.Success, PTT.ErrorCode.PostDeleted)
    TIMEOUT = 20

    def __init__(self, crawler_configs: Config):
        self.__configs = crawler_configs
        self.__ptt = PTT.Library(
            ID=self.__configs.username,
            Password=self.__configs.password,
            kickOtherLogin=self.__configs.kick_others)
        self.__ranges = self.__configs.ranges
        self.__db = self.__configs.db
        self.__stopped = True
        self.__stop = False

    def stop(self):
        """
        stop crawling
        """

        self.__stop = True

    def __find_index(self, board, newest, timestamp):
        # binary search
        left, right, found = 1, newest, False

        print('[crawler]', 'binary search for timestamp', timestamp, 'on board', board)

        # find start index
        while abs(left - right) > 1 and not found:
            middle = (left + right) // 2
            print('[crawler]', 'binary search left', left, 'middle', middle, 'right', right)

            # linear search lhs
            for i in range(middle, left, -1):
                status = PTT.ErrorCode.UnknowError
                while status not in Crawler.SUCCESS_OR_DELETED:
                    thread = threading.Timer(Crawler.TIMEOUT, self.__ptt.logout)
                    thread.start()
                    status, post = self.__ptt.getPost(Board=board, PostIndex=i)
                    thread.cancel()
                print('[crawler]', i, ('deleted' if status == PTT.ErrorCode.PostDeleted else ''))
                if status == PTT.ErrorCode.Success:
                    middle = i
                    break
            # if not found in lhs then search rhs
            if status != PTT.ErrorCode.Success:
                for i in range(middle + 1, right):
                    status = PTT.ErrorCode.UnknowError
                    while status not in Crawler.SUCCESS_OR_DELETED:
                        thread = threading.Timer(Crawler.TIMEOUT, self.__ptt.logout)
                        thread.start()
                        status, post = self.__ptt.getPost(Board=board, PostIndex=i)
                        thread.cancel()
                    print(
                        '[crawler]', i,
                        ('deleted' if status == PTT.ErrorCode.PostDeleted else ''))
                    if status == PTT.ErrorCode.Success:
                        middle = i
                        break
            # if not found in both side
            if status != PTT.ErrorCode.Success:
                found = True
                break

            post_time = get_post_time(post)
            if post_time == timestamp:
                print('[crawler]', '[' + board + ']', middle, post_time, '==', post_time, 'return')
                left = middle
                found = True
                break
            elif post_time < timestamp:
                print('[crawler]', '[' + board + ']', middle, post_time, '<', post_time, 'left = mid')
                left = middle
            else:
                print('[crawler]', '[' + board + ']', middle, post_time, '>', post_time, 'right = mid')
                right = middle

        return left

    def __newest_index(self, board):
        status = PTT.ErrorCode.UnknowError
        while status != PTT.ErrorCode.Success:
            thread = threading.Timer(Crawler.TIMEOUT, self.__ptt.logout)
            thread.start()
            status, newest = self.__ptt.getNewestIndex(Board=board)
            thread.cancel()
        return newest

    def __crawl_post(self, board, index):
        print('[crawler] crawling', '[' + board + ']', index)
        status = PTT.ErrorCode.UnknowError
        while status not in Crawler.SUCCESS_OR_DELETED:
            thread = threading.Timer(Crawler.TIMEOUT, self.__ptt.logout)
            thread.start()
            status, post = self.__ptt.getPost(Board=board, PostIndex=index)
            thread.cancel()
            
            print(
                '[crawler] success or deleted:',
                status in Crawler.SUCCESS_OR_DELETED,
                'title:',
                post.getTitle())
        self.__db.insert_or_update_post(post)

    def __crawl_posts_in_time_range(self, board, time_start, time_end):
        print('[crawler]', '[' + board + ']', 'start_time', time_start)
        print('[crawler]', '[' + board + ']', 'end_time', time_end)

        newest = self.__newest_index(board)
        if newest == -1:
            eprint('[crawler]', 'failed to get newest index on board:', board)
            return False

        start_index, end_index = (
            self.__find_index(board, newest, time_start),
            self.__find_index(board, newest, time_end))

        print(
            '[crawler]',
            'start crawling from index', start_index,
            'to index', end_index,
            'in board', '[' + board + ']')
        for i in range(start_index, end_index + 1):
            self.__crawl_post(board, i)

        return True

    def start(self):
        """
        start crawling in caller thread with infinity loop
        """

        if self.__stopped and not self.__stop:
            ptt = self.__ptt

            if ptt.login() != PTT.ErrorCode.Success:
                self.__stopped = True
                return
            self.__stopped = False

            while not self.__stop:
                for range_ in self.__ranges:
                    current = get_current_time()
                    board = range_.board
                    time_begin = range_.time_begin
                    time_end = range_.time_end
                    period = range_.period

                    last_time = self.__db.get_time_range_last_crawled(board, time_begin, time_end)

                    if current - last_time < period:
                        continue

                    status = self.__crawl_posts_in_time_range(
                        board,
                        current - time_begin,
                        current - time_end
                    )

                    if status:
                        self.__db.set_time_range_crawled(board, time_begin, time_end)

                time.sleep(1)

            ptt.logout()
            self.__stopped = True

    def __start_in_new_thread(self):
        while not self.__stop:
            thread = threading.Thread(target=self.start)
            thread.start()
            thread.join()

    def start_in_new_thread(self):
        """
        start crawling in a new thread
        """

        if len(self.__ranges) > 0:
            threading.Thread(target=self.__start_in_new_thread).start()
