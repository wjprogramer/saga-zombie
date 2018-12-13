from threading import Lock
import jieba
import os

jieba.enable_parallel(os.cpu_count())


def cut(string):
    with cut.lock:
        return jieba.cut(string, cut_all=True)


cut.lock = Lock()
