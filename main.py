"""
main
"""

import atexit
import json

from utils import eprint
from crawler.crawler import Crawler
from crawler.settings import Settings
from db.instance import make_db_instance


def check_config(configs):
    print(configs)
    if 'database' not in configs:
        eprint('"database" was not set in', CONFIG_FILE_PATH)
        exit(1)
    if 'type' not in configs['database']:
        eprint('database type was not set')
        exit(1)
    if configs['database']['type'] == 'sqlite':
        if 'path' not in configs['database']:
            eprint('sqlite path was not set')
            exit(1)
    else:
        eprint('unknown database type', configs['database']['type'])
        exit(1)
    if 'crawlers' in configs and len(configs['crawlers']) > 0:
        pass
    else:
        print('crawler not set')


if __name__ == '__main__':
    CONFIG_FILE_PATH = './config.json'
    with open(CONFIG_FILE_PATH) as config_file:
        CONFIGS = json.load(config_file)
    check_config(CONFIGS)
    
    db = make_db_instance(CONFIGS['database'])
    if db.connect():
        atexit.register(db.close)
    else:
        eprint('error when connecting to the database')
        exit(1)
