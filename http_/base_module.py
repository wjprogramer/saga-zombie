"""base HTTP module
"""

from traceback import print_exc
from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse
from urllib.parse import parse_qs
import json

from db.sqlite_db_handler import SQLiteDBHandler
from utils import get_current_time_str

class RequiredParam:
    """Required Parameters
    """

    def __init__(self, keyword: str, value_type=str, default=None):
        self.keyword = keyword
        self.value_type = value_type
        self.default = default

class BaseModule:
    """base module
    """

    CONTENT_TYPE = 'Content-Type'
    CONTENT_LENGTH = 'Content-Length'
    CONTENT_TYPE_JSON = 'application/json'
    ENCODING = 'utf-8'

    @staticmethod
    def start_caching_thread(db_handler):
        pass

    def __init__(self, request_handler: BaseHTTPRequestHandler, db_handler: SQLiteDBHandler):
        self.request_handler = request_handler
        self.db_handler = db_handler

        parsed_result = urlparse(self.request_handler.path)
        self.path = parsed_result.path
        self.query = parse_qs(parsed_result.query)

        self.params = list()

        print(
            '[' + get_current_time_str() + ']',
            self.request_handler.client_address,
            self.request_handler.path)

        if self.__check_param():
            self.__handle()

    def __get_param(self, keyword: str, value_type=str, default=None):
        """get the value of the keyword in the query
        if the keyword exist,
        else return the default value
        """

        try:
            return value_type(self.query[keyword][0])
        except (IndexError, KeyError, TypeError, ValueError):
            return default

    def __send_status_code(self, code: int):
        """send status code to client
        """

        self.request_handler.send_response_only(code)

    def __send_header(self, keyword, value):
        """send header to client
        """

        self.request_handler.send_header(keyword, value)

    def __end_headers(self):
        """end headers
        """

        self.request_handler.end_headers()

    def __write(self, data):
        """write response body
        """

        if not isinstance(data, bytes):
            data = str(data).encode(BaseModule.ENCODING)
        self.request_handler.wfile.write(data)

    def __handle(self):
        try:
            data = json.dumps(self.get_data())
        except:
            print_exc()
            data = json.dumps({'status': 'module fault'})
        try:
            self.__send_status_code(200)
            self.__send_header(BaseModule.CONTENT_TYPE, BaseModule.CONTENT_TYPE_JSON)
            self.__send_header(BaseModule.CONTENT_LENGTH, len(data))
            self.__end_headers()
            self.__write(data)
        except BrokenPipeError:
            print('Client closed', self.request_handler.client_address)

    def __missing_param(self, keyword):
        self.__send_status_code(400)
        self.__send_header(BaseModule.CONTENT_TYPE, BaseModule.CONTENT_TYPE_JSON)
        self.__write(json.dumps({
            'status': 'failed',
            'info': 'missing `' + keyword + '`'
        }))

    def __check_param(self):
        for param in self.required_param():
            p = self.__get_param(param.keyword, param.value_type, param.default)
            if p is None and param.default is None:
                self.__missing_param(param.keyword)
                return False
            self.params.append(p)
        return True

    def not_found(self):
        self.__send_status_code(404)
        self.__send_header(BaseModule.CONTENT_TYPE, BaseModule.CONTENT_TYPE_JSON)
        self.__end_headers()
        self.__write(json.dumps({'status': 'failed', 'info': 'not found'}))

    def required_param(self):
        """check client input

        parameter: list(RequiredParam)
        """

        return []

    def get_params(self):
        """return the parameters required from `required_param()`
        """

        return tuple(self.params)

    def get_data(self):
        """return the real data

        it will be called when there's not
        existing cache or existing cache

        the data will be encoded as JSON and send to client
        """

        raise NotImplementedError()
