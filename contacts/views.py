import flask

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from flask import request
import dotenv

dotenv.load_dotenv(dotenv_path=os.path.abspath(os.path.join(__file__, "..", "..", ".env")))

def render_contacts():
    

    if flask.request.method == "POST":

        name_user = flask.request.form["name"]
        telephone_user = flask.request.form.get("number")
        email_user = flask.request.form["email"]
        user_msg= request.form.get("text")

        message = f"Ім'я користувача : {name_user},\n Номер телефону : {telephone_user},\n Електронна пошта : {email_user},\n Повідомлення : {user_msg}"
      
        msg = MIMEText(message)
        msg["Subject"] = "Повідомлення від користувача"
        msg["From"] = email_user 
        msg["To"] = os.getenv("SENDER_EMAIL") 
        msg["Reply-To"] = email_user

        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server :
            server.login(os.getenv("SENDER_EMAIL"), os.getenv("PASSWORD_APP") )
            server.send_message(msg)
            # тут робити повідомлення про успішну відправку
    return flask.render_template(template_name_or_list="contacts.html")

