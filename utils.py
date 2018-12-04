"""
utilities module
"""

import re
import sys
import time

from PTTLibrary.Information import PostInformation
from PTTLibrary.Information import PushInformation


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


def get_post_time(post: PostInformation) -> int:
    """
    return the release time of the post (unix time)
    """
    try:
        return int(
            time.mktime(
                time.strptime(
                    post.getDate().strip(),
                    '%a %b %d %H:%M:%S %Y'
                )
            )
        ) - CURRENT_TIME_ZONE_OFFSET + PTT_TIME_ZONE_OFFSET
    except:
        return 0


def get_post_year(post: PostInformation) -> int:
    """
    return the year of the post, ex. 2020
    """

    try:
        return int(
            time.mktime(
                time.strptime(
                    post.getDate().strip()[20:],
                    '%Y'
                )
            )
        ) - CURRENT_TIME_ZONE_OFFSET + PTT_TIME_ZONE_OFFSET
    except:
        return 0


def get_push_time(year: int, push: PushInformation):
    """
    return the timestamp fo the push (unix time)
    """

    try:
        return int(
            time.mktime(
                time.strptime(
                    push.getTime(),
                    '%m/%d %H:%M'
                )
            )
        ) + BASE_TIME + year - CURRENT_TIME_ZONE_OFFSET + PTT_TIME_ZONE_OFFSET
    except:
        return year


def get_post_author_id(post: PostInformation) -> str:
    """
    return the author id of the post
    """

    try:
        return get_post_author_id.pattern.match(post.getAuthor().strip()).group(1)
    except:
        return ''


get_post_author_id.pattern = re.compile('^([a-zA-Z0-9]*)')
