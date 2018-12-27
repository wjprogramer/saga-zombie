"""get_user_pushes_word_freq module
"""

from collections import Counter

from http_.base_module import BaseModule
from http_.base_module import RequiredParam
from utils import get_current_time
import words_statistics

class Module(BaseModule):
    """get_user_pushes_word_freq module
    """

    def required_param(self):
        return (
            RequiredParam('username'),
            RequiredParam('beginning_day', int, 7),
            RequiredParam('ending_day', int, 0)
        )

    def get_data(self):
        params = self.get_params()
        current = get_current_time()
        username = params[0]
        beginning_day = params[1]
        ending_day = params[2]

        query_result = self.db_handler.query('''
SELECT `content` FROM `pushes`
WHERE `author` = (
    SELECT `id` FROM `users`
    WHERE `username` = :username
) AND `date_time` BETWEEN :time_begin AND :time_end ;''',
            {
                'username': username,
                'time_begin': current - beginning_day * 86400,
                'time_end': current - ending_day * 86400
            })

        counter = Counter()
        for row in query_result:
            counter.update(words_statistics.cut(row[0]))

        return counter
