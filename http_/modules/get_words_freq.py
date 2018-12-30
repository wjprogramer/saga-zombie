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

    def __init__(self, timestamp, counter):
        self.timestamp = timestamp
        self.counter = counter
        self.lock = Lock()

class Module(BaseModule):
    """get_word_freq module
    """

    cache = dict()
    cache_lock = Lock()
    CACHE_LIFE = 1200
    ROUTINE_PERIOD = 900
    caching_thread_checking_lock = Lock()
    caching_thread = None
    CATCH_TOP_N_WORDS = 200

    def required_param(self):
        return (
            RequiredParam('beginning_day', int, 1),
            RequiredParam('ending_day', int, 0)
        )

    @staticmethod
    def __free_cache():
        current = get_current_time()
        with Module.cache_lock:
            days_cache = tuple(Module.cache.values())
        for day_cache in days_cache:
            with day_cache.lock:
                if Module.CACHE_LIFE < current - day_cache.timestamp:
                    day_cache.counter = None

    @staticmethod
    def __get_day_cache(day):
        with Module.cache_lock:
            if day not in Module.cache:
                day_cache = DayCache(0, None)
                Module.cache[day] = day_cache
            else:
                day_cache = Module.cache[day]
        return day_cache

    @staticmethod
    def __update_counter(db_handler, day, day_cache):
        print('[module get_word_freq] updating counter for day:', day)

        current = get_current_time()

        query_result = db_handler.query('''
SELECT `content` FROM `posts_content`
WHERE `post` IN (
    SELECT `id` FROM `posts`
    WHERE `date_time` BETWEEN :time_begin AND :time_end
);''',
            {
                'time_begin': current - (day + 1) * 86400,
                'time_end': current - day * 86400
            })

        counter = Counter()
        for row in query_result:
            raw = words_statistics.cut(row[0])
            counter.update(words_statistics.basic_filter(raw))

        day_cache.timestamp = get_current_time()
        day_cache.counter = counter

        return counter

    @staticmethod
    def __get_counter(db_handler, day, day_cache):
        current = get_current_time()

        if day < 360:
            counter = day_cache.counter
            if counter is not None:
                return counter
            with day_cache.lock:
                return day_cache.counter

        with day_cache.lock:
            if Module.CACHE_LIFE <= current - day_cache.timestamp:
                return Module.__update_counter(db_handler, day, day_cache)
            return day_cache.counter

    @staticmethod
    def __caching_thread_routine(db_handler):
        while True:
            try:
                print('[module get_word_freq] in caching thread routine')
                Module.__free_cache()
                for day in range(0, 360):
                    day_cache = Module.__get_day_cache(day)
                    with day_cache.lock:
                        Module.__update_counter(db_handler, day, day_cache)
                sleep(Module.ROUTINE_PERIOD)
            except KeyboardInterrupt as e:
                raise e
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
        if ending_day < 0 or beginning_day < ending_day:
            return {}
        if beginning_day - ending_day > 30:
            ending_day = beginning_day - 30

        result = Counter()

        # compute the result
        for day in range(ending_day, beginning_day + 1):
            day_cache = Module.__get_day_cache(day)

            counter = Module.__get_counter(self.db_handler, day, day_cache)

            result.update(counter)

        result = list((k, v) for k, v in result.most_common(Module.CATCH_TOP_N_WORDS))

        return {'statistic': result}
