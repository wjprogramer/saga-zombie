"""
utilities module
"""

import re
import sys
import time
from traceback import print_exc


def eprint(*args, **kwargs):
    """
    print messages to stderr
    print(*args, file=sys.stderr, **kwargs)
    """
    print(*args, file=sys.stderr, **kwargs)


BASE_TIME = -int(time.mktime(time.strptime('', '')))
PTT_TIME_ZONE_OFFSET = 28800
CURRENT_TIME_ZONE_OFFSET = \
    int(time.mktime(time.localtime())) - \
    int(time.mktime(time.gmtime()))


def get_current_time() -> int:
    """
    return int(time.time())
    """
    return int(time.time())


def get_current_time_str() -> str:
    """return time.strftime('%Y%m%d-%H%M%S')
    """

    return time.strftime('%Y%m%d-%H%M%S')


def get_post_time(timestamp: str) -> int:
    """
    return the release time of the post (unix time)
    """
    try:
        return int(
            time.mktime(
                time.strptime(
                    timestamp.strip(),
                    '%a %b %d %H:%M:%S %Y'
                )
            )
        ) - CURRENT_TIME_ZONE_OFFSET + PTT_TIME_ZONE_OFFSET
    except:
        return 0


def get_post_year(timestamp: str) -> int:
    """
    return the year of the post, ex. 2020
    """

    try:
        return int(timestamp.strip()[20:])
    except:
        return 0


def get_push_ip_time(year: int, ip_timestamp: str):
    """
    return the timestamp fo the push (unix time)
    """

    try:
        ip = None
        splitted = ip_timestamp.split()
        if len(splitted) == 3:
            ip, timestamp = splitted[0], ' '.join(splitted[1:])
        else:
            timestamp = ip_timestamp
        return ip, int(
            time.mktime(
                time.strptime(
                    str(year) + timestamp.strip(),
                    '%Y%m/%d %H:%M'
                )
            )
        ) - CURRENT_TIME_ZONE_OFFSET + PTT_TIME_ZONE_OFFSET
    except:
        try:
            return ip, time.mktime(time.strptime(str(year), '%Y'))
        except:
            return ip, 0


def get_post_author_id(author: str) -> str:
    """
    return the author id of the post
    """

    try:
        return get_post_author_id.pattern.match(author.strip()).group(1)
    except:
        return ''


get_post_author_id.pattern = re.compile('^([a-zA-Z0-9]*)')
