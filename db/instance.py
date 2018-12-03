from . import sqlite_db_handler
from utils import eprint

def make_db_instance(configs):
    if configs['type'] == 'sqlite':
        try:
            with open(configs['path'], 'w'):
                pass
        except IOError:
            eprint('could not read or write', configs['path'])
        return sqlite_db_handler.SQLiteDBHandler(configs['path'])
