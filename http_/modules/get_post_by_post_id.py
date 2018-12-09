"""get_post_by_post_id module
"""

import json

from http_.base_module import BaseModule

class Module(BaseModule):
    """get_post_by_post_id module
    """

    def handle(self):
        post_id = self.get_param('post_id')

        if post_id is None:
            self.send_status_code(400)
            self.send_header(BaseModule.CONTENT_TYPE, BaseModule.CONTENT_TYPE_JSON)
            self.write(json.dumps({
                'status': 'failed',
                'info': 'missing post_id'
            }))
            return

        query_result = self.db_handler.query('''
SELECT `board`, `users`.`username`, `date_time`, `title`, `web_url`, `money`, `ip`
LEFT JOIN `users` ON `posts`.`author` = `users`.`id`
WHERE `posts`.`post_id` = :post_id ;''', {'post_id': post_id})


        if len(query_result) > 0:
            self.send_status_code(200)
            self.send_header(BaseModule.CONTENT_TYPE, BaseModule.CONTENT_TYPE_JSON)
            self.end_headers()
            self.write(json.dumps({
                'board': query_result[0],
                'author': query_result[1],
                'date_time': query_result[2],
                'title': query_result[3],
                'web_url': query_result[4],
                'money': query_result[5],
                'ip': query_result[6]
            }))
        else:
            self.send_status_code(404)
            self.send_header(BaseModule.CONTENT_TYPE, BaseModule.CONTENT_TYPE_JSON)
            self.end_headers()
            self.write(json.dumps({'status': 'failed', 'info': 'not found'}))
