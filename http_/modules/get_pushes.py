"""get_users_pushes module
"""

from http_.base_module import BaseModule
from http_.base_module import RequiredParam
from utils import get_current_time

class Module(BaseModule):
    """get_users_pushes module
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
SELECT
    `boards`.`name` as `board`,
    `posts`.`post_id` as `post_id`,
    `pushes`.`type` as `type`,
    `users`.`username` as `author`,
    `pushes`.`ip` as `ip`,
    `pushes`.`date_time` as `date_time`
FROM `pushes`
LEFT JOIN `posts` ON `posts`.`id` = `pushes`.`post`
LEFT JOIN `users` ON `users`.`id` = `pushes`.`author`
LEFT JOIN `boards` ON `boards`.`id` = `posts`.`board`
WHERE
`pushes`.`date_time`
BETWEEN :time_begin AND :time_end ;''',
            {
                'time_begin': int(current - beginning_day * 86400),
                'time_end': int(current - ending_day * 86400)
            })

        kw_result = list()
        for row in query_result:
            kw_result.append({
                'board': row[0],
                'post_id': row[1],
                'type': row[2],
                'author': row[3],
                'ip': row[4],
                'date_time': row[5],
            })

        return kw_result
