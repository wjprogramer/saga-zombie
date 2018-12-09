"""
crawler module
"""

import time
import threading

from PTTLibrary import PTT
from . import configs
from utils import get_post_time
from utils import get_current_time


class Crawler:
    """
    Crawler class
    """

    SUCCESS_OR_DELETED = (PTT.ErrorCode.Success, PTT.ErrorCode.PostDeleted)

    def __init__(self, crawler_configs: configs):
        self.__configs = crawler_configs
        self.__ptt = PTT.Library(
            ID=self.__configs.get_username(),
            Password=self.__configs.get_password(),
            kickOtherLogin=False)
        self.__stopped = True

    def stop(self):
        """
        stop crawling
        """

        self.__stopped = True

    def __find_index(self, newest, timestamp):
        ptt = self.__ptt
        board = self.__configs.get_board()
        # binary search
        left, right, found = 1, newest, False

        print('binary search for timestamp', timestamp, 'on board', board)

        # find start index
        while abs(left - right) > 1 and not found:
            middle = (left + right) // 2
            print('binary search left', left, 'middle', middle, 'right', right)

            # linear search lhs
            for i in range(middle, left, -1):
                status = PTT.ErrorCode.UnknowError
                while status not in Crawler.SUCCESS_OR_DELETED:
                    status, post = ptt.getPost(Board=board, PostIndex=i)
                print(i, (' deleted' if status == PTT.ErrorCode.PostDeleted else ''))
                if status == PTT.ErrorCode.Success:
                    middle = i
                    break
            # if not found in lhs then search rhs
            if status != PTT.ErrorCode.Success:
                for i in range(middle + 1, right):
                    status = PTT.ErrorCode.UnknowError
                    while status not in Crawler.SUCCESS_OR_DELETED:
                        status, post = ptt.getPost(Board=board, PostIndex=i)
                    print(i, (' deleted' if status == PTT.ErrorCode.PostDeleted else ''))
                    if status == PTT.ErrorCode.Success:
                        middle = i
                        break
            # if not found in both side
            if status != PTT.ErrorCode.Success:
                found = True
                break

            post_time = get_post_time(post)
            if post_time == timestamp:
                print('[' + board + ']', middle, post_time, '==', post_time, 'return')
                left = middle
                found = True
                break
            elif post_time < timestamp:
                print('[' + board + ']', middle, post_time, '<', post_time, 'left = mid')
                left = middle
            else:
                print('[' + board + ']', middle, post_time, '>', post_time, 'right = mid')
                right = middle

        return left

    def start(self):
        """
        start crawling in caller thread with infinity loop
        """

        if self.__stopped:
            ptt = self.__ptt
            _configs = self.__configs
            board = _configs.get_board()
            db = _configs.get_database()
            current = get_current_time()

            if ptt.login() != PTT.ErrorCode.Success:
                self.__stopped = True
                return
            self.__stopped = False

            while not self.__stopped:
                sleep_until = get_current_time() + _configs.get_period()

                time_start = current - _configs.get_time_start()
                time_end = current - _configs.get_time_end()

                print('start_time', time_start)
                print('end_time', time_end)

                status = PTT.ErrorCode.UnknowError
                while status != PTT.ErrorCode.Success:
                    status, newest = ptt.getNewestIndex(Board=_configs.get_board())

                if newest == -1:
                    self.__stopped = True
                    break

                start_index, end_index = (
                    self.__find_index(newest, time_start),
                    self.__find_index(newest, time_end))

                print(
                    'start crawling from index',
                    start_index,
                    'to index',
                    end_index,
                    'in board',
                    '[' + board + ']')
                for i in range(start_index, end_index + 1):
                    print('crawling', '[' + board + ']', i)
                    status = PTT.ErrorCode.UnknowError
                    while status not in Crawler.SUCCESS_OR_DELETED:
                        status, post = ptt.getPost(Board=board, PostIndex=i)
                        print('status:', status, 'title:', post.getTitle())
                    db.insert_or_update_post(post)

                sleep_time = sleep_until - get_current_time()
                print('sleep for', sleep_time, 'seconds')
                if not self.__stopped and sleep_time > 0:
                    time.sleep(sleep_time)

            ptt.logout()

    def start_in_new_thread(self):
        """
        start crawling in a new thread
        """

        threading.Thread(target=self.start).start()
