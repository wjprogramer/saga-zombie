"""get_posts_by_username module
"""

from http_.base_module import BaseModule
from http_.base_module import RequiredParam

from utils import get_current_time

class Module(BaseModule):
    """get_posts_by_username module
    """

    def required_param(self):
        return (
            RequiredParam('username'),
            RequiredParam('beginning_day', float, 7),
            RequiredParam('ending_day', float, 0),
        )

    def get_data(self):
        username = self.get_params()[0]
        beginning_day = self.get_params()[1]
        ending_day = self.get_params()[2]
        current = get_current_time()

        result = self.db_handler.query('''
SELECT
    `boards`.`name` as `board`,
    `posts`.`post_id` as `post_id`,
    `posts`.`date_time` as `date_time`,
    `posts`.`title` as `title`,
    `posts`.`web_url` as `web_url`,
    `posts`.`ip` as `ip`
FROM `posts`
LEFT JOIN `boards` ON `boards`.`id` = `posts`.`board`
WHERE `posts`.`author` = (
    SELECT `id` FROM `users`
    WHERE `username` = :username
) AND `posts`.`date_time`
BETWEEN :beginning AND :ending ;
            ''',
            {
                'username': username,
                'beginning': int(current - beginning_day * 86400),
                'ending': int(current - ending_day * 86400)
            }
        )
        kw_posts = list()
        for row in result:
            kw_posts.append({
                'board': row[0],
                'post_id': row[1],
                'date_time': row[2],
                'title': row[3],
                'web_url': row[4],
                'ip': row[5]
            })
        return kw_posts
