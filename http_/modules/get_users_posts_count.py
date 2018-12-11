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
            RequiredParam('time_begin', int, 604800),
            RequiredParam('time_end', int, 0)
        )

    def get_data(self):
        params = self.get_params()
        current = get_current_time()
        time_begin = params[0]
        time_end = params[1]

        query_result = self.db_handler.query('''
SELECT `users`.`username`, COUNT(`posts`.`author`) FROM `posts`
LEFT JOIN `users` ON  `posts`.`author` = `users`.`id`
WHERE `posts`.`date_time` BETWEEN :time_begin AND :time_end
GROUP BY `posts`.`author` ;''',
            {
                'time_begin': current - time_begin,
                'time_end': current - time_end
            })

        kw_result = list()
        for row in query_result:
            kw_result.append({
                'username': row[0],
                'count': row[1]
            })

        return kw_result
