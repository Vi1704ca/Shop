from flask_login import current_user
import flask, functools
from Project.settings import status_order

def config_page(rule_name: str, optional_value=None):
    def manage(function: object):
        @functools.wraps(function)
        def inner(*args, **kwargs):
            context = function(*args, **kwargs)
            context.setdefault('current_user', current_user)
            context.setdefault('status_order', status_order)

            if optional_value is not None:
                context['optional_value'] = optional_value

            return flask.render_template(rule_name, **context)
        return inner
    return manage