"""
utilities module
"""

import sys


def eprint(*args, **kwargs):
    """
    print messages to stderr
    print(*args, file=sys.stderr, **kwargs)
    """
    print(*args, file=sys.stderr, **kwargs)
