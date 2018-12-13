"""dynamic loading modules (development use)
"""

import importlib
import os

def load(module: str):
    """dynamic loading modules (development use)
    """

    file_path = module.replace('.', '/') + '.py'
    if not os.path.isfile(file_path):
        return None
    mtime = os.path.getmtime(file_path)
    if module not in load.modules_mtime:
        load.modules_mtime[module] = mtime
    elif load.modules_mtime[module] != mtime:
        load.modules_mtime[module] = mtime
        return importlib.reload(importlib.import_module(module))
    return importlib.import_module(module)


load.modules_mtime = dict()
