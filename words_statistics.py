from threading import Lock
import jieba
import os

jieba.enable_parallel(os.cpu_count())


def cut(string):
    with cut.lock:
        return jieba.cut(string, cut_all=True)


def basic_filter(d):
    d = map(lambda x: x.strip(), d)
    d = filter(lambda x: len(x) > 1, d)
    d = filter(lambda x: not x.isnumeric(), d)
    d = filter(lambda x: x not in USELESS, d)
    d = filter(lambda x: x not in USELESS, c)
    d = filter(lambda x: x not in MORE_USELESS_WORDS, c)
    return d


cut.lock = Lock()
USELESS = (
    'https',
    'ptt',
    'cc',
    'Gossiping',
    '文章',
    'www',
    'com',
    '看板',
    '自己',
    '作者',
    'html',
    'bbs',
    'Dec',
    'Nov',
    'Oct',
    'Sep',
    'Aug',
    'Jul',
    'Jun',
    'May',
    'Apr',
    'Mar',
    'Feb',
    'Jan',
    '踢踢',
    'imgur',
    'Sun',
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat',
    'jpg',
    'Re',
    'http',
    'tw',
    'from',
    'to',
)
MORE_USELESS_WORDS = (,)
with open('useless_words.txt') as f:
    MORE_USELESS_WORDS = tuple(line[:-1] for line in f)
