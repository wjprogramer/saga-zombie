"""get_user_pushes_word_freq module
"""

from collections import Counter

from http_.base_module import BaseModule
from http_.base_module import RequiredParam
from utils import get_current_time
import jb

class Module(BaseModule):
    """get_user_pushes_word_freq module
    """

    def required_param(self):
        return (
            RequiredParam('username'),
            RequiredParam('time_begin', int, 604800),
            RequiredParam('time_end', int, 0)
        )

    def get_data(self):
        params = self.get_params()
        current = get_current_time()
        username = params[0]
        time_begin = params[1]
        time_end = params[2]

        query_result = self.db_handler.query('''
SELECT `content` FROM `pushes`
WHERE `author` = (
    SELECT `id` FROM `users`
    WHERE `username` = :username
) AND `date_time` BETWEEN :time_begin AND :time_end ;''',
            {
                'username': username,
                'time_begin': current - time_begin,
                'time_end': current - time_end
            })

        counter = Counter()
        for row in query_result:
            counter.update(jb.cut(row[0]))

        return counter
