import flask
from .models import Profile
from Project.db import DATABASE

def render_cabinet():
    if flask.request.method == "POST":
        last_name = flask.request.form.get("last_name")
        first_name = flask.request.form.get("first_name")
        middle_name = flask.request.form.get("middle_name")
        date_of_birth = flask.request.form.get("date_of_birth")
        phone_number = flask.request.form.get("phone_number")
        email = flask.request.form.get("email")

        profile = Profile(
            last_name=last_name,
            first_name=first_name,
            middle_name=middle_name,
            date_of_birth=date_of_birth,
            phone_number=phone_number,
            email=email
        )
        DATABASE.session.add(profile)
        DATABASE.session.commit()
    return flask.render_template(template_name_or_list="cabinet.html")


def render_cabinet_myorders():
    return flask.render_template(template_name_or_list="myorders.html")
def render_cabinet_address_order():
    return flask.render_template(template_name_or_list="address-order.html")