"""base HTTP module
"""

from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse
from urllib.parse import parse_qs
import time

from db.sqlite_db_handler import SQLiteDBHandler

class BaseModule:
    """base module
    """

    CONTENT_TYPE = 'Content-Type'
    CONTENT_TYPE_JSON = 'text/json'
    ENCODING = 'utf-8'

    def __init__(self, request_handler: BaseHTTPRequestHandler, db_handler: SQLiteDBHandler):
        self.request_handler = request_handler
        self.db_handler = db_handler

        parsed_result = urlparse(self.request_handler.path)
        self.path = parsed_result.path
        self.query = parse_qs(parsed_result.query)

        self.handle()

    def send_status_code(self, code: int):
        """send status code to client
        """

        self.request_handler.send_response(code)

    def send_header(self, keyword, value):
        """send header to client
        """

        self.request_handler.send_header(keyword, value)

    def end_headers(self):
        """end headers
        """

        self.request_handler.end_headers()

    def write(self, data):
        """write response body
        """

        if not isinstance(data, bytes):
            data = str(data).encode(BaseModule.ENCODING)
        self.request_handler.wfile.write(data)

    def flush(self):
        """flush
        """

        self.request_handler.wfile.flush()

    def handle(self):
        """handle the request

        This method should be implemented by it's subclasses
        """

        raise NotImplementedError()
