"""get_pushes_by_username module
"""

from http_.base_module import BaseModule
from http_.base_module import RequiredParam
from utils import get_current_time

class Module(BaseModule):
    """get_pushes_by_username module
    """

    def required_param(self):
        return (
            RequiredParam('username'),
            RequiredParam('beginning_day', float, 7),
            RequiredParam('ending_day', float, 0)
        )

    def get_data(self):
        params = self.get_params()
        username = params[0]
        current = get_current_time()
        beginning_day = params[1]
        ending_day = params[2]

        query_result = self.db_handler.query('''
SELECT
    `boards`.`name` as `board`,
    `posts`.`post_id` as `post_id`,
    `pushes`.`type` as `type`,
    `pushes`.`content` as `content`,
    `pushes`.`ip` as `ip`,
    `pushes`.`date_time` as `date_time`
FROM `pushes`
LEFT JOIN `posts` ON `posts`.`id` = `pushes`.`post`
LEFT JOIN `boards` ON `boards`.`id` = `posts`.`board`
WHERE `pushes`.`author` = (
    SELECT `id` FROM `users`
    WHERE `username` = :username
) AND `pushes`.`date_time`
BETWEEN :time_begin AND :time_end ;
            ''',
            {
                'username': username,
                'time_begin': int(current - beginning_day * 86400),
                'time_end': int(current - ending_day * 86400)
            }
        )

        result = list()
        
        for row in query_result:
            result.append({
                'board': row[0],
                'post_id': row[1],
                'type': row[2],
                'content': row[3],
                'ip': row[4],
                'date_time': row[5]
            })

        return result
