"""get_post_word_freq module
"""

from collections import Counter

from http_.base_module import BaseModule
from http_.base_module import RequiredParam
import jb

class Module(BaseModule):
    """get_post_word_freq module
    """

    def required_param(self):
        return (RequiredParam('post_id'),)

    def get_data(self):
        post_id = self.get_params()[0]

        query_result = self.db_handler.query('''
SELECT `content` FROM `posts_content`
WHERE `post` = (
    SELECT `id` FROM `posts`
    WHERE `post_id` = :post_id
) ;''', {'post_id': post_id})

        try:
            return Counter(jb.cut(query_result[0][0]))
        except IndexError:
            return {}
