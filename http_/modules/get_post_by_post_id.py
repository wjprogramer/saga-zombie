"""get_post_by_post_id module
"""

import json

from http_.base_module import BaseModule
from http_.base_module import RequiredParam

class Module(BaseModule):
    """get_post_by_post_id module
    """

    def required_param(self):
        return (RequiredParam('post_id'),)

    def get_data(self):
        post_id = self.get_params()[0]

        query_result = self.db_handler.query('''
SELECT `boards`.`name`, `users`.`username`, `date_time`, `title`, `web_url`, `money`, `ip` FROM `posts`
LEFT JOIN `users` ON `posts`.`author` = `users`.`id`
LEFT JOIN `boards` ON `posts`.`board` = `boards`.`id`
WHERE `posts`.`post_id` = :post_id ;''', {'post_id': post_id})

        try:
            return dict({
                'board': query_result[0][0],
                'author': query_result[0][1],
                'date_time': query_result[0][2],
                'title': query_result[0][3],
                'web_url': query_result[0][4],
                'money': query_result[0][5],
                'ip': query_result[0][6]
            })
        except IndexError:
            return {}
