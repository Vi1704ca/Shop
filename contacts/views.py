import flask

def render_contacts():
    return flask.render_template(template_name_or_list="contacts.html")