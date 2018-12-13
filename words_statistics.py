from threading import Lock
import jieba
import os

jieba.enable_parallel(os.cpu_count())


def cut(string):
    with cut.lock:
        return basic_filter(jieba.cut(string, cut_all=True))


def basic_filter(i):
    a = map(lambda x: x.strip(), i)
    b = filter(lambda x: len(x) > 1, a)
    c = filter(lambda x: not x.isnumeric(), b)
    d = filter(lambda x: x not in USELESS, c)
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
    'tw'
)
