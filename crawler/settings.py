class Settings:
    def __init__(self, board, time_start, time_end, period, username, password, db):
        self.__board = board
        self.__time_start = time_start
        self.__time_end = time_end
        self.__period = period
        self.__username = username
        self.__password = password
        self.__db = db

    def get_board(self):
        return self.__board

    def get_duration(self):
        return (self.__time_start, self.__time_end)

    def get_period(self):
        return self.__period

    def get_username(self):
        return self.__username

    def get_password(self):
        return self.__password

    def get_database(self):
        return self.__db
