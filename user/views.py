import flask
import flask_login

from Project.db import DATABASE
from Project.config_page import config_page

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from itsdangerous import URLSafeTimedSerializer

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
                print(f"SUCCESS: User registered - {email_form}, status will be: {status}")
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
s = URLSafeTimedSerializer(os.getenv("SECRET_KEY", "your-secret-key"))
print(f"DEBUG: SECRET_KEY loaded: {os.getenv('SECRET_KEY', 'your-secret-key')[:10]}...")

def email_password():
    confirm = flask.request.args.get('action') == 'agreement-reset-password'
    token_from_url = flask.request.args.get('token')
    
    print(f"DEBUG: confirm={confirm}, token_from_url={token_from_url}")
    
    if confirm and not token_from_url:
        print("DEBUG: No token provided, redirecting to authorization")
        return flask.redirect('/authorization')
    
    if confirm and not token_from_url:
        print("DEBUG: No token provided, redirecting to authorization")
        return flask.redirect('/authorization')
    
    if confirm and token_from_url:
        try:
            email = s.loads(token_from_url, salt='password-reset-salt', max_age=1800)  
            print(f"DEBUG: Token valid for email: {email}")

        except Exception as e:
            print(f"DEBUG: Token invalid: {e}, token: {token_from_url}")
            print("DEBUG: Token validation disabled for debugging")
    
    if flask.request.method == "POST":
        form_source = flask.request.form.get('form_identity')

        if form_source == "send-email":
            receiver_email = flask.request.form.get("email_pass")
            token = s.dumps(receiver_email, salt='password-reset-salt')
            print(f"DEBUG: Generated token for email {receiver_email}: {token}")
            
            sender_email = os.getenv("SENDER_EMAIL")
            password = os.getenv("PASSWORD_APP")
    
            message = MIMEMultipart()
            message["From"] = f"DronShop Support <{sender_email}>"
            message["To"] = receiver_email
            message["Subject"] = "Відновлення пароля"
    
            reset_link = f"{flask.request.host_url.rstrip('/')}/?action=agreement-reset-password&token={token}"
            body = f"Для встановлення нового пароля перейдіть за посиланням:\n{reset_link}"
            message.attach(MIMEText(body, "plain"))
    
            try:
                server = smtplib.SMTP_SSL("smtp.gmail.com", 465)
                server.login(sender_email, password)
                server.sendmail(sender_email, receiver_email, message.as_string())
                server.quit()
                print("Лист успішно відправлено!")
            except Exception as e:
                print(f"Помилка: {e}")
                
        elif form_source == "save-new-password":
            token = flask.request.form.get('token') or flask.request.args.get('token') or token_from_url
            new_password = flask.request.form.get("new_password")
            confirm_p = flask.request.form.get("confirm_new_password")

            print(f"DEBUG: Form source detected: save-new-password")
            print(f"DEBUG: Token from form: {flask.request.form.get('token')}")
            print(f"DEBUG: Token from URL args: {flask.request.args.get('token')}")
            print(f"DEBUG: Token from stored: {token_from_url}")
            print(f"DEBUG: Final token: {token}")

            if not token:
                print("Помилка: токен не знайдено!")
                return flask.render_template("password_reset.html", confirm_reset_password=False, error="Токен не знайдено"), 400

            if not new_password or not confirm_p:
                print("Помилка: поля паролю не заповнено!")
                return flask.render_template("password_reset.html", confirm_reset_password=True, error="Будь ласка, заповніть обидва поля паролю"), 400

            if new_password != confirm_p:
                print("Помилка: паролі не збігаються!")
                return flask.render_template("password_reset.html", confirm_reset_password=True, error="Паролі не збігаються"), 400

            if len(new_password) < 3:
                print("Помилка: пароль занадто короткий!")
                return flask.render_template("password_reset.html", confirm_reset_password=True, error="Пароль повинен мати мінімум 3 символи"), 400

            try:
                email = s.loads(token, salt='password-reset-salt', max_age=1800)
                print(f"DEBUG: Token successfully decoded for email: {email}")
                
                user = User.query.filter_by(email=email).first()
                if user:
                    user.password = new_password 
                    DATABASE.session.commit()
                    print(f"Пароль для {email} успішно оновлено!")
                    return flask.render_template("password_reset.html", 
                                               confirm_reset_password=False, 
                                               show_success=True), 200
                else:
                    print(f"Користувача з email {email} не знайдено!")
                    return flask.render_template("password_reset.html", 
                                               confirm_reset_password=True, 
                                               error="Користувача не знайдено"), 404
            except Exception as e:
                print(f"Токен недійсний або застарів! Помилка: {e}")
                import traceback
                traceback.print_exc()
                return flask.render_template("password_reset.html", 
                                           confirm_reset_password=False, 
                                           error=f"Токен недійсний або застарів: {str(e)}"), 400
    
    print(f"DEBUG: Rendering template with confirm_reset_password={confirm}")
    return flask.render_template("password_reset.html", confirm_reset_password=confirm, token=token_from_url or '')

# def agreement_reset_password():
#    print("Користувач перейшов по посиланню скидання пароля")
#    return flask.redirect(flask.url_for('home.render_home', action='agreement-reset-password'))