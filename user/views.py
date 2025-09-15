import flask
import flask_login

from Project.db import DATABASE
from Project.config_page import config_page


from .models import User

@config_page(template_name= 'registration.html')
def render_registration() -> dict:
    message = ''
    if flask.request.method == "POST":
        password = flask.request.form["password"]
        confirm_password = flask.request.form["confirm_password"]
        email_form = flask.request.form["email"]

        email_model = User.query.filter_by(email = email_form).first()
        
        if email_model is None:
            if password == confirm_password:
                user = User(
                    username = flask.request.form["username"],
                    email = email_form,
                    password = password
                )
                DATABASE.session.add(user)
                DATABASE.session.commit()
                message = "Успешная регистрация"
            else:
                message = "Пароли не совпадают"
        else:
            message = "Пользователь с такой почтой уже зарегистрирован"
    
    return {'message': message}

def render_authorization():
    
    if flask.request.method == "POST":
        username_form = flask.request.form["username"]
        password_form = flask.request.form["password"]

        list_users = User.query.all()
        for user in list_users:
            if user.username == username_form and user.password == password_form:
                flask_login.login_user(user)
    if not flask_login.current_user.is_authenticated:
        return flask.render_template("authorization.html")
    else:
        return flask.redirect("/")

def logout():
    flask.session.clear()
    return flask.redirect("/")    