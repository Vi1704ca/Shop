from flask_login import current_user
import flask, functools

def config_page(rule_name: str, optional_value=None):
    def manage(function: object):
        @functools.wraps(function)
        def inner(*args, **kwargs):
            context = function(*args, **kwargs)
            # Добавляем optional_value в контекст, если оно было передано
            if optional_value is not None:
                context['optional_value'] = optional_value
            return flask.render_template(
                template_name_or_list=rule_name,
                current_user=current_user,
                **context
            )
        return inner
    return manage