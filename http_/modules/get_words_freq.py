"""get_word_freq module
"""

from traceback import print_exc
from collections import Counter
from threading import Thread
from threading import Lock
from time import sleep

from http_.base_module import BaseModule
from http_.base_module import RequiredParam
from utils import get_current_time
import words_statistics

class DayCache:
    """cache class
    """

    def __init__(self, counter=None):
        self.counter = counter

class Module(BaseModule):
    """get_word_freq module
    """

    cache = dict()
    cache_lock = Lock()
    CACHE_DAYS = 365
    ROUTINE_PERIOD = 900
    caching_thread_checking_lock = Lock()
    caching_thread = None
    CATCH_TOP_N_WORDS = 200

    def required_param(self):
        return (
            RequiredParam('beginning_day', int, 1),
            RequiredParam('ending_day', int, 0),
            RequiredParam('board', str, 'Gossiping')
        )

    @staticmethod
    def __get_boards(db_handler):
        return db_handler.query('SELECT `id` FROM `boards`;')

    @staticmethod
    def __get_board_id(db_handler, board_name):
        try:
            return db_handler.query(
                'SELECT `id` FROM `boards` WHERE `name` = :name ;',
                {'name': board_name}
            )[0][0]
        except (IndexError, KeyError, TypeError):
            return None

    @staticmethod
    def __update_counter(db_handler, day, day_cache, board):
        print('[module get_word_freq] updating counter for day:', board, day)

        current = get_current_time()

        query_result = db_handler.query('''
SELECT `content` FROM `posts_content`
WHERE `post` IN (
    SELECT `id` FROM `posts`
    WHERE `date_time` BETWEEN :time_begin AND :time_end
    AND `board` =  :board
);''',
            {
                'board': board,
                'time_begin': current - (day + 1) * 86400,
                'time_end': current - day * 86400
            })

        counter = Counter()
        for row in query_result:
            raw = words_statistics.cut(row[0])
            counter.update(words_statistics.basic_filter(raw))

        day_cache.counter = counter

        return counter

    @staticmethod
    def __caching_thread_routine(db_handler):
        while True:
            try:
                print('[module get_word_freq] in caching thread routine')
                for board in map(lambda x: x[0], Module.__get_boards(db_handler)):
                    for day in range(Module.CACHE_DAYS):
                        if board not in Module.cache:
                            Module.cache[board] = dict()
                        board_cache = Module.cache[board]
                        if day not in board_cache:
                            board_cache[day] = DayCache()
                        day_cache = board_cache[day]
                        Module.__update_counter(db_handler, day, day_cache, board)
                sleep(Module.ROUTINE_PERIOD)
            except KeyboardInterrupt as exception:
                raise exception
            except:
                print_exc()

    @staticmethod
    def start_caching_thread(db_handler):
        if Module.caching_thread is None or not Module.caching_thread.is_alive():
            print('[module get_word_freq] create new routine thread')
            Module.caching_thread = Thread(
                target=Module.__caching_thread_routine, args=[db_handler], daemon=True)
            Module.caching_thread.start()

    def get_data(self):
        params = self.get_params()
        beginning_day = params[0]
        ending_day = params[1]
        board = Module.__get_board_id(self.db_handler, params[2])

        if board is None:
            return {}

        if ending_day < 0 or beginning_day < ending_day:
            return {}

        result = Counter()

        # compute the result
        for day in range(ending_day, beginning_day + 1):
            try:
                counter = Module.cache[board][day].counter
                result.update(counter)
            except (KeyError, TypeError, NameError):
                pass

        result = list((k, v) for k, v in result.most_common(Module.CATCH_TOP_N_WORDS))

        return {'statistic': result}
