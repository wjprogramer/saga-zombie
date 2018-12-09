"""get_posts_by_username module
"""

import json

from http_.base_module import BaseModule

class Module(BaseModule):
    """get_posts_by_username module
    """

    def handle(self):

        username = self.get_param('username')

        if username is None:
            self.send_status_code(400)
            self.send_header(BaseModule.CONTENT_TYPE, BaseModule.CONTENT_TYPE_JSON)
            self.write(json.dumps({
                'status': 'failed',
                'info': 'missing parameters'
            }))
            return

        posts = self.db_handler.get_posts_by_username(username)
        kw_posts = list()
        for post in posts:
            kw_post = dict()
            kw_post['post_id'] = post[2]
            kw_post['date_time'] = post[4]
            kw_post['title'] = post[5]
            kw_post['web_url'] = post[6]
            kw_post['money'] = post[7]
            kw_post['ip'] = post[8]
            kw_posts.append(kw_post)
        self.send_status_code(200)
        self.send_header(BaseModule.CONTENT_TYPE, BaseModule.CONTENT_TYPE_JSON)
        self.end_headers()
        self.write(json.dumps(kw_posts))
