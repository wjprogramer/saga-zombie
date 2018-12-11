"""get_posts_by_username module
"""

from http_.base_module import BaseModule
from http_.base_module import RequiredParam

class Module(BaseModule):
    """get_posts_by_username module
    """

    def required_param(self):
        return (RequiredParam('username'),)

    def get_data(self):
        username = self.get_params()[0]

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
        return kw_posts
