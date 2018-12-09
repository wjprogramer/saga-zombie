"""test module
"""

import json

from ..base_module import BaseModule

class Module(BaseModule):
    """module for handle user request
    """

    def handle(self):
        """handle user request
        """

        self.send_status_code(200)
        self.send_header(BaseModule.CONTENT_TYPE, BaseModule.CONTENT_TYPE_JSON)
        self.end_headers()
        self.write(json.dumps({'status': 'ok!'}))
