from flask_login import current_user
import flask
import traceback
import linecache


import colorama
colorama.init(autoreset= True)

RED = colorama.Fore.RED
YELLOW = colorama.Fore.YELLOW
MAGNETA = colorama.Fore.MAGENTA



def is_admin(redirect_url: str = '/'):
    def wrapper(function: object):
        def inner(*args, **kwars):
            try:
                if current_user.is_admin and current_user.is_authenticated:
                    function(*args, **kwars)
            except Exception as error:
                # 1.
                traceback.print_exc()
                # 2.
                ERROR = traceback.extract_tb(tb= error.__traceback__)[-1]
                print(f'{YELLOW}File: {RED}{ERROR.filename}\n{YELLOW}line: {ERROR.lineno}\n{YELLOW}Function: {RED}{ERROR.name}')
                print(linecache.getline(ERROR.filename, ERROR.lineno))
                print(f'{MAGNETA}{error.__class__.__name__}: {error}')
            finally:
                return flask.redirect(redirect_url)
        return inner
    return wrapper