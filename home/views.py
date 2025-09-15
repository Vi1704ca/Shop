import flask
import flask_login

from Project.config_page import config_page


@config_page(template_name= 'home.html')
def render_home():
    return {}
    