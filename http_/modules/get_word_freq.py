"""get_word_freq module
"""

from collections import Counter

from http_.base_module import BaseModule
from http_.base_module import RequiredParam
from utils import get_current_time
import jb

class Module(BaseModule):
    """get_word_freq module
    """

    def required_param(self):
        return (
            RequiredParam('time_begin', int, 86400),
            RequiredParam('time_end', int, 0)
        )

    def get_data(self):
        params = self.get_params()
        current = get_current_time()
        time_begin = params[0]
        time_end = params[1]
        if time_begin - time_end > 86400 * 30:
            time_end = time_begin - 86400 * 30

        query_result = self.db_handler.query('''
SELECT `content` FROM `posts_content`
WHERE `post` IN (
    SELECT `id` FROM `posts`
    WHERE `date_time` BETWEEN :time_begin AND :time_end
);''',
            {
                'time_begin': current - time_begin,
                'time_end': current - time_end
            })

        kw_result = Counter()
        for row in query_result:
            kw_result.update(jb.cut(row[0]))

        return kw_result
