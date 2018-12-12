import jieba
import os

jieba.enable_parallel(os.cpu_count())


def cut(string):
    return jieba.cut(string, cut_all=True)
