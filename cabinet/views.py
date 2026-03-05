import flask


def render_cabinet():
    return flask.render_template(template_name_or_list="cabinet.html")
