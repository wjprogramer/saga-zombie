"""get_users_posts_count module
"""

from http_.base_module import BaseModule
from http_.base_module import RequiredParam
from utils import get_current_time

class Module(BaseModule):
    """get_users_posts_count module
    """

    def required_param(self):
        return (
            RequiredParam('beginning_day', float, 7),
            RequiredParam('ending_day', float, 0)
        )

    def get_data(self):
        params = self.get_params()
        current = get_current_time()
        beginning_day = params[0]
        ending_day = params[1]

        query_result = self.db_handler.query('''
SELECT `users`.`username`, COUNT(`posts`.`author`) FROM `posts`
LEFT JOIN `users` ON  `posts`.`author` = `users`.`id`
WHERE `posts`.`date_time` BETWEEN :time_begin AND :time_end
GROUP BY `posts`.`author` ;''',
            {
                'time_begin': float(current - beginning_day * 86400),
                'time_end': float(current - ending_day * 86400)
            })

        kw_result = list()
        for row in query_result:
            kw_result.append({
                'username': row[0],
                'count': row[1]
            })

        return kw_result
