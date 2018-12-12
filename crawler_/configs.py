
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
        config['kick_others'],
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
        self.board = board
        self.time_begin = time_begin
        self.time_end = time_end
        self.period = period

class Config:
    """crawler config object
    """

    CONFIG_KEYS = {
        'username': str,
        'password': str,
        'kick_others': bool,
        'ranges': list
    }

    def __init__(self, username, password, kick_others, db, ranges):
        self.username = username
        self.password = password
        self.kick_others = kick_others
        self.db = db
        self.ranges = ranges
