import flask

def render_order():
    return flask.render_template('order.html')

def render_success():
    return flask.render_template('success.html')