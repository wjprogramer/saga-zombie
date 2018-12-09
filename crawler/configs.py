
from utils import eprint


def check_crawler_configs(config):
    for k, v in Config.CONFIG_KEYS.items():
        if k not in config:
            eprint('key [', k, '] not in crawler config')
            return False
        if not isinstance(config[k], v):
            eprint('key [', k, '] type error')
            return False
    if config['username'] == '':
        eprint('field `username` in some of crawler configs are empty')
        return False
    if config['password'] == '':
        eprint('field `password` in some of crawler configs are empty')
        return False
    ranges = config['ranges']
    for k, v in ConfigTimeRange.CONFIG_KEYS.items():
        for range_ in ranges:
            if k not in range_:
                eprint('key [', k, '] not in crawler ranges')
                return False
            if not isinstance(range_[k], v):
                eprint('key [', k, '] type error')
                return False
    return True


def make_crawler_config_objects(config, db):
    ranges = list()
    for range_ in config['ranges']:
        ranges.append(
            ConfigTimeRange(
                range_['board'],
                range_['time_begin'],
                range_['time_end'],
                range_['period']
            )
        )
    return Config(
        config['username'],
        config['password'],
        db,
        ranges
    )


class ConfigTimeRange:
    """crawler time range options
    """

    CONFIG_KEYS = {
        'board': str,
        'time_begin': int,
        'time_end': int,
        'period': int
    }

    def __init__(self, board, time_begin, time_end, period):
        self.__board = board
        self.__time_begin = time_begin
        self.__time_end = time_end
        self.__period = period

    def get_board(self):
        return self.__board

    def get_time_begin(self):
        return self.__time_begin

    def get_time_end(self):
        return self.__time_end

    def get_period(self):
        return self.__period

class Config:
    """
    crawler config object
    """

    CONFIG_KEYS = {
        'username': str,
        'password': str,
        'ranges': list
    }

    def __init__(self, username, password, db, ranges):
        self.__username = username
        self.__password = password
        self.__db = db
        self.__ranges = ranges

    def get_username(self):
        return self.__username

    def get_password(self):
        return self.__password

    def get_database(self):
        return self.__db

    def get_time_ranges(self):
        return self.__ranges
