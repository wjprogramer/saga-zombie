from threading import Lock
import jieba
import jieba.analyse
import os

jieba.enable_parallel(os.cpu_count())


def extract_tags(content, topK=20):
    with extract_tags.lock:
        return jieba.analyse.extract_tags(content, topK=topK)


def basic_filter(d):
    d = map(lambda x: x.strip(), d)
    d = filter(lambda x: len(x) > 1, d)
    d = filter(lambda x: not x.isnumeric(), d)
    d = filter(lambda x: x not in MORE_USELESS_WORDS, d)
    return d


extract_tags.lock = Lock()

with open('useless_words.txt') as f:
    MORE_USELESS_WORDS = set(line[:-1] for line in f)

with open('hot_nouns.txt') as f:
    HOT_NOUNS = set(line[:-1] for line in f)
    jieba.suggest_freq(HOT_NOUNS, tune=True)
