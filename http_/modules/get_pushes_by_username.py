"""get_pushes_by_username module
"""

import json

from http_.base_module import BaseModule
from utils import get_current_time

class Module(BaseModule):
    """get_pushes_by_username module
    """

    def handle(self):
        username = self.get_param('username')
        current = get_current_time()
        time_begin = self.get_param('time_begin', 604800)
        time_end = self.get_param('time_end', 0)

        if username is None:
            self.send_status_code(400)
            self.send_header(BaseModule.CONTENT_TYPE, BaseModule.CONTENT_TYPE_JSON)
            self.write(json.dumps({
                'status': 'failed',
                'info': 'missing parameters'
            }))
            return

        pushes_query_result = self.db_handler.query('''
SELECT `posts`.`id`, `type`, `content`, `ip`, `date_time` FROM `pushes`
WHERE `username` = (
    SELECT `id` FROM `users` WHERE `username` = :username
) AND `date_time` BETWEEN :time_begin AND :time_end ;''', {
    'username': username,
    'time_begin': current - time_begin,
    'time_end': current - time_end
})

        posts_query_result = self.db_handler.query('''
SELECT `posts`.`id`, `posts`.`post_id` FROM `posts`
WHERE `id` IN (
    SELECT `post` FROM `pushes`
    WHERE `username` = (
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
        for k, v in pushes:
            kw_result[id_to_post_id[k]] = v

        self.send_status_code(200)
        self.send_header(BaseModule.CONTENT_TYPE, BaseModule.CONTENT_TYPE_JSON)
        self.end_headers()
        self.write(json.dumps(kw_result))
