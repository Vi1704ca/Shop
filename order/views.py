import flask
from Project.settings import status_order
from Project.config_page import config_page

def render_order():
    return flask.render_template('order.html')


@config_page(rule_name='success.html')
def render_success():
    local_order = "success"
    return {"status_order": local_order}