
from utils import eprint


def check_crawler_configs(config):
    for k, v in Config.CONFIG_KEYS.items():
        if k not in config:
            eprint('key [', k, '] not in crawler config')
            return False
        if not isinstance(config[k], v):
            eprint('key [', k, '] type error')
            return False
    ranges = config['ranges']
    for k, v in ConfigPageRange.CONFIG_KEYS.items():
        for range_ in ranges:
            if k not in range_:
                eprint('key [', k, '] not in crawler ranges')
                return False
            if not isinstance(range_[k], v):
                eprint('key [', k, '] type error')
                return False
    return True


def make_crawler_config_objects(config, database):
    ranges = list()
    for range_ in config['ranges']:
        ranges.append(
            ConfigPageRange(
                range_['board'],
                range_['beginning_page'],
                range_['ending_page'],
                range_['period']
            )
        )
    return Config(
        database,
        ranges
    )


class ConfigPageRange:
    """crawler time range options
    """

    CONFIG_KEYS = {
        'board': str,
        'beginning_page': int,
        'ending_page': int,
        'period': int
    }

    def __init__(self, board, beginning_page, ending_page, period):
        self.board = board
        self.beginning_page = beginning_page
        self.ending_page = ending_page
        self.period = period

class Config:
    """crawler config object
    """

    CONFIG_KEYS = {
        'ranges': list
    }

    def __init__(self, database, ranges):
        self.database = database
        self.ranges = ranges
