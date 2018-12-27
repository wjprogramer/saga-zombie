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
            RequiredParam('beginning_day', int, 7),
            RequiredParam('ending_day', int, 0)
        )

    def get_data(self):
        params = self.get_params()
        username = params[0]
        current = get_current_time()
        beginning_day = params[1]
        ending_day = params[2]

        pushes_query_result = self.db_handler.query('''
SELECT `post`, `type`, `content`, `ip`, `date_time` FROM `pushes`
WHERE `author` = (
    SELECT `id` FROM `users` WHERE `username` = :username
) AND `date_time` BETWEEN :time_begin AND :time_end ;''', {
    'username': username,
    'time_begin': current - beginning_day * 86400,
    'time_end': current - ending_day * 86400
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
    'time_begin': current - beginning_day * 86400,
    'time_end': current - ending_day * 86400
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
