"""
main
"""

import atexit
import json

from utils import eprint
from crawler.configs import check_crawler_configs
from crawler.configs import make_crawler_config_objects
from crawler.crawler import Crawler
from db.instance import make_db_instance
from db.instance import check_db_config


def check_config(configs):
    print(configs)
    if 'database' not in configs:
        eprint('"database" was not set in', CONFIG_FILE_PATH)
        exit(1)
    check_db_config(configs['database'])
    if 'crawlers' in configs and len(configs['crawlers']) > 0:
        check_crawler_configs(configs['crawlers'])
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

    crawler_configs = make_crawler_config_objects(CONFIGS['crawlers'], db)
    crawlers = list()
    for config in crawler_configs:
        crawlers.append(Crawler(config))
    crawlers[0].start()
