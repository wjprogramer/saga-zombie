import importlib
import os

modules_mtime = dict()


def load(module: str):
    file_path = module.replace('.', '/') + '.py'
    if not os.path.isfile(file_path):
        return None
    mtime = os.path.getmtime(file_path)
    if module not in modules_mtime:
        modules_mtime[module] = mtime
    elif modules_mtime[module] != mtime:
        modules_mtime[module] = mtime
        return importlib.reload(importlib.import_module(module))
    return importlib.import_module(module)
