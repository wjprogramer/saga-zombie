"""test module
"""

from http_.base_module import BaseModule

class Module(BaseModule):
    """module for handle user request
    """

    def get_data(self):
        """handle user request
        """

        return {'status': 'ok'}
