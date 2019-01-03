"""get_post_word_freq module
"""

from collections import Counter

from http_.base_module import BaseModule
from http_.base_module import RequiredParam
import words_statistics

class Module(BaseModule):
    """get_post_word_freq module
    """

    def required_param(self):
        return (
            RequiredParam('board'),
            RequiredParam('post_id'),
        )

    def get_data(self):
        board = self.get_params()[0]
        post_id = self.get_params()[1]

        query_result = self.db_handler.query('''
SELECT `content` FROM `posts_content`
WHERE `post` = (
    SELECT `id` FROM `posts`
    WHERE `post_id` = :post_id
    AND `board` = (
        SELECT `id` FROM `boards`
        WHERE `name` = :board
    )
);
            ''',
            {
                'post_id': post_id,
                'board': board
            }
        )

        try:
            return Counter(words_statistics.basic_filter(
                words_statistics.extract_tags(query_result[0][0])))
        except IndexError:
            return {}
