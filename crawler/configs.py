
from utils import eprint


CONFIG_KEYS = {
    'username': str,
    'password': str,
    'board': str,
    'time_start': int,
    'time_end': int,
    'period': int
}


def check_crawler_configs(configs):
    for config in configs:
        for k, v in CONFIG_KEYS:
            if k not in config:
                eprint('key [' + k + '] not in crawler config')
                exit(1)
            if not isinstance(config[k], v):
                eprint('key [' + k + '] type error')
                exit(1)
        if config['username'] == '':
            eprint('field `username` in some of crawler configs are empty')
            exit(1)
        if config['password'] == '':
            eprint('field `password` in some of crawler configs are empty')
            exit(1)


def make_crawler_config_object(configs, db):
    result = list()
    for config in configs:
        result.append(Configs(
            config['board'],
            config['time_start'],
            config['time_end'],
            config['period'],
            config['username'],
            config['password'],
            db
        ))
    return result


class Configs:
    def __init__(self, board, time_start, time_end, period, username, password, db):
        self.__board = board
        self.__time_start = time_start
        self.__time_end = time_end
        self.__period = period
        self.__username = username
        self.__password = password
        self.__db = db

    def get_board(self):
        return self.__board

    def get_time_start(self):
        return self.__time_start

    def get_time_end(self):
        return self.__time_end

    def get_period(self):
        return self.__period

    def get_username(self):
        return self.__username

    def get_password(self):
        return self.__password

    def get_database(self):
        return self.__db
