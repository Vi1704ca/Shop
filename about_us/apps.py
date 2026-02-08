import flask

about_us = flask.Blueprint(
    name = "about_us",
    import_name = "about_us",
    static_url_path = "/about_us/static",
    static_folder= "static",
    template_folder="templates"
)