import flask
import flask_login

from Project.db import DATABASE
from Project.config_page import config_page

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from .models import User

import os
import dotenv

@config_page(rule_name= 'registration.html')
def render_registration() -> dict:
    message = ''
    status = 'form' 
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
                status = 'registration-success'
            else:
                message = "Пароли не совпадают"
        else:
            message = "Користувач із такою електронною поштою вже зареєстрований. Будь ласка, створіть нове ім'я та пароль"
    
    return {"message": message, "status": status}

def render_authorization():
    if flask.request.method == "POST":
        email_form = flask.request.form["email"]
        password_form = flask.request.form["password"]

        user = User.query.filter_by(email=email_form).first()

        if user and user.password == password_form:
            flask_login.login_user(user)
            return "success"

        return "error"

    return flask.render_template("authorization.html")

def logout():
    flask.session.clear()
    return flask.redirect("/")    

def render_resetPassword():
    return flask.render_template("password_reset.html")


dotenv.load_dotenv(dotenv_path=os.path.abspath(os.path.join(__file__, "..", "..", ".env")))

def email_password():

    confirm = flask.request.args.get('action') == 'agreement-reset-password'

    if flask.request.method == "POST":
        receiver_email = flask.request.form["email_pass"]
        print(receiver_email)

        sender_email = os.getenv("SENDER_EMAIL")
        password = os.getenv("PASSWORD_APP")

        message = MIMEMultipart()
        message["From"] = f"DronShop Support <{sender_email}>"
        message["To"] = receiver_email
        message["Subject"] = os.getenv("SUBJECT")

        reset_link = flask.url_for('home.render_home', _external=True) + '?action=agreement-reset-password'

        body = f"""
        Вітаємо!

        Ви отримали це повідомлення, оскільки ми отримали запит на відновлення доступу до вашого облікового запису в магазині DronShop.

        Для встановлення нового пароля перейдіть за посиланням:
        {reset_link}
        Якщо ви не робили цього запиту, просто проігноруйте цей лист.
        З повагою, команда DronShop.
        """

        message.attach(MIMEText(body, "plain"))

        try:
            server = smtplib.SMTP_SSL("smtp.gmail.com", 465)
            server.login(sender_email, password)
            server.sendmail(sender_email, receiver_email, message.as_string())
            server.quit()
            print("Лист успішно відправлено!")
        except Exception as e:
            print(f"Помилка: {e}")
    
    return flask.render_template("password_reset.html", confirm_reset_password=confirm)

# def agreement_reset_password():
#    print("Користувач перейшов по посиланню скидання пароля")
#    return flask.redirect(flask.url_for('home.render_home', action='agreement-reset-password'))