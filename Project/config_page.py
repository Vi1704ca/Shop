import flask, flask_login

def config_page(template_name: str):
    def render_template(function: object):
        def processor(*args, **kwargs):
            context = function(*args, **kwargs)
            return flask.render_template(
                template_name_or_list= template_name,
                current_user= flask_login.current_user,
                **context
            )
        return processor
    return render_template

