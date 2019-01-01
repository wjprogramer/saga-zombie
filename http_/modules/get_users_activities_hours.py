"""get_users_activities_hours module
"""

from http_.base_module import BaseModule
from http_.base_module import RequiredParam
from utils import get_ptt_today_time


class Module(BaseModule):
    """get_users_activities_hours module
    """

    def required_param(self):
        return (
            RequiredParam('beginning_day', int, 1),
            RequiredParam('ending_day', int, 0),
        )

    def get_data(self):
        params = self.get_params()
        beginning_day = params[0]
        ending_day = params[1]
        today = get_ptt_today_time()

        if ending_day < 0 or beginning_day < ending_day:
            return {}

        result = dict()

        for day in range(ending_day, beginning_day):
            print(beginning_day, ending_day)
            query = self.db_handler.query(
                '''
SELECT
    `users`.`username`,
    `pushes`.`date_time`
FROM `pushes`
LEFT JOIN `users` ON `users`.`id` = `pushes`.`author`
WHERE
    `pushes`.`date_time` BETWEEN
        :time_start AND :time_end ;
                ''',
                {
                    'time_start': today - (day + 1) * 86400,
                    'time_end': today - day * 86400
                }
            )
            users = dict()
            for row in query:
                user = row[0]
                timestamp = row[1]
                if user not in users:
                    users[user] = list([0] * 24)
                users[user][timestamp % 86400 // 3600] = 1
            for user in users:
                users[user] = sum(users[user])
            result[day] = users

        return {'statistic': result}
