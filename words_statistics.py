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
    d = filter(lambda x: x not in MORE_USELESS_WORDS, d)
    return d


cut.lock = Lock()

with open('useless_words.txt') as f:
    MORE_USELESS_WORDS = tuple(line[:-1] for line in f)
