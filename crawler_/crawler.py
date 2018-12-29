"""
crawler module
"""

import time
import threading
import importlib

from PttWebCrawler import crawler

from utils import eprint
from utils import get_post_time
from utils import get_current_time

from crawler_.configs import Config

class Crawler:
    """Crawler class
    """

    TIMEOUT = 20
    RETRY_SLEEP = 90

    def __init__(self, crawler_configs: Config):
        self.__configs = crawler_configs
        self.__page_ranges = self.__configs.ranges
        self.__db = self.__configs.database
        self.__stopped = True
        self.__stop = False

    def stop(self):
        """
        stop crawling
        """

        self.__stop = True

    def start(self):
        """
        start crawling in caller thread with infinity loop
        """

        self.__stop = False
        if self.__stopped:
            self.__stopped = False
            try:
                while not self.__stop:
                    for page_range in self.__page_ranges:
                        if self.__stop:
                            break
                        last_time = self.__db.get_page_range_last_crawled(
                            page_range.board, page_range.beginning_page, page_range.ending_page)
                        if get_current_time() - last_time < page_range.period:
                            continue
                        while not self.__stop:
                            last_index = crawler.getLastPage(page_range.board, Crawler.TIMEOUT)
                            if last_index != -1:
                                break
                        for index in range(
                                max(1, last_index - page_range.beginning_page),
                                max(1, last_index - page_range.ending_page + 1)):
                            while not self.__stop:
                                articles = crawler.parse_articles(
                                    index, index, page_range.board, Crawler.TIMEOUT)
                                if len(articles) > 0:
                                    break
                            for article in articles:
                                self.__db.insert_or_update_post(article)
                        self.__db.set_page_range_crawled(
                            page_range.board, page_range.beginning_page, page_range.ending_page)
                    print('sleep(1)')
                    time.sleep(1)
            finally:
                self.__stopped = True

    def __start_in_new_thread(self):
        while not self.__stop:
            print('[crawler] create new thread')
            thread = threading.Thread(target=self.start)
            print('[crawler] start thread')
            thread.start()
            thread.join()
            print('[crawler] thread joined, sleep... Zzz...')
            time.sleep(Crawler.RETRY_SLEEP)

    def start_in_new_thread(self):
        """
        start crawling in a new thread
        """

        if len(self.__page_ranges) > 0:
            threading.Thread(target=self.__start_in_new_thread).start()
