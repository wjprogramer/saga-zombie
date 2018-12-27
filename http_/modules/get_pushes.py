"""get_users_pushes_count module
"""

from http_.base_module import BaseModule
from http_.base_module import RequiredParam
from utils import get_current_time

class Module(BaseModule):
    """get_users_pushes_count module
    """

    def required_param(self):
        return (
            RequiredParam('beginning_day', int, 7),
            RequiredParam('ending_day', int, 0)
        )

    def get_data(self):
        params = self.get_params()
        current = get_current_time()
        beginning_day = params[0]
        ending_day = params[1]

        query_result = self.db_handler.query('''
SELECT
    `posts`.`post_id` as `post_id`,
    `pushes`.`type` as `type`,
    `users`.`username` as `username`,
    `pushes`.`ip` as `ip`,
    `pushes`.`date_time` as `date_time`
FROM `pushes`
LEFT JOIN `posts` ON `posts`.`id` = `pushes`.`post`
LEFT JOIN `users` ON `users`.`id` = `pushes`.`author`
WHERE
`pushes`.`date_time`
BETWEEN :time_begin AND :time_end ;''',
            {
                'time_begin': current - beginning_day * 86400,
                'time_end': current - ending_day * 86400
            })

        kw_result = list()
        for row in query_result:
            kw_result.append({
                'post_id': row[0],
                'type': row[1],
                'username': row[2],
                'ip': row[3],
                'date_time': row[4],
            })

        return kw_result
