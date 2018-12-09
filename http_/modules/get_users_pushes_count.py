"""get_users_pushes_count module
"""

import json

from http_.base_module import BaseModule
from utils import get_current_time

class Module(BaseModule):
    """get_users_pushes_count module
    """

    def handle(self):

        current = get_current_time()
        time_begin = self.get_param('time_begin', 604800)
        time_end = self.get_param('time_end', 0)

        query_result = self.db_handler.query('''
SELECT `users`.`username`, COUNT(`pushes`.`author`) FROM `pushes`
LEFT JOIN `users` ON  `pushes`.`author` = `users`.`id`
WHERE `pushes`.`date_time` BETWEEN :time_begin AND :time_end
GROUP BY `pushes`.`author` ;''',
            {
                'time_begin': current - time_begin,
                'time_end': current - time_end
            })

        kw_result = list()
        for row in query_result:
            kw_result.append({
                'username': row[0],
                'count': row[1]
            })

        self.send_status_code(200)
        self.send_header(BaseModule.CONTENT_TYPE, BaseModule.CONTENT_TYPE_JSON)
        self.end_headers()
        self.write(json.dumps(kw_result))
