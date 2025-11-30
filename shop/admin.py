from flask_login import current_user
import flask, traceback


def is_admin(function: object) -> float: # функція що приймає параметри для редіректу на сторінку
    def handler(*args, **kwargs): # Функція обробник фунції параметру із wrapper
        try:
            if current_user.is_authenticated and current_user.is_admin:
                function(*args, **kwargs)
        except Exception as ERROR:
            traceback.print_exc()
        finally:
            return flask.redirect('/shop')
    return handler

