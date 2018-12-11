"""get_pushes_by_username module
"""

import json

from http_.base_module import BaseModule
from http_.base_module import RequiredParam
from utils import get_current_time

class Module(BaseModule):
    """get_pushes_by_username module
    """

    def required_param(self):
        return (
            RequiredParam('username'),
            RequiredParam('time_begin', int, 604800),
            RequiredParam('time_end', int, 0)
        )

    def get_data(self):
        params = self.get_params()
        username = params[0]
        current = get_current_time()
        time_begin = params[1]
        time_end = params[2]

        pushes_query_result = self.db_handler.query('''
SELECT `post`, `type`, `content`, `ip`, `date_time` FROM `pushes`
WHERE `author` = (
    SELECT `id` FROM `users` WHERE `username` = :username
) AND `date_time` BETWEEN :time_begin AND :time_end ;''', {
    'username': username,
    'time_begin': current - time_begin,
    'time_end': current - time_end
})

        posts_query_result = self.db_handler.query('''
SELECT `id`, `post_id` FROM `posts`
WHERE `id` IN (
    SELECT `post` FROM `pushes`
    WHERE `author` = (
        SELECT `id` FROM `users` WHERE `username` = :username
    ) AND `date_time` BETWEEN :time_begin AND :time_end
);''', {
    'username': username,
    'time_begin': current - time_begin,
    'time_end': current - time_end
})

        id_to_post_id = dict()
        pushes = dict()
        for row in posts_query_result:
            id_to_post_id[row[0]] = row[1]
            pushes[row[0]] = list()

        for row in pushes_query_result:
            pushes[row[0]].append(dict({
                'type': row[1],
                'content': row[2],
                'ip': row[3],
                'date_time': row[4]
            }))

        kw_result = dict()
        for k, v in pushes.items():
            kw_result[id_to_post_id[k]] = v

        return kw_result
