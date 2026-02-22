# если я не пишу ничего - смотрю конспект
import flask
contacts = flask.Blueprint(
    name = "contacts",
    import_name = "contacts",
    static_url_path="/contacts/static/",
    static_folder="static",
    template_folder="templates"
)