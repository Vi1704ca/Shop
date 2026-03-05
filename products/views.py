import flask

def render_drone():
    return flask.render_template('drone.html')

def render_thermalI():
    return flask.render_template('thermalI.html')