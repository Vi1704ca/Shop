import flask
cabinet = flask.Blueprint(
    name = "cabinet",
    import_name = "cabinet",
    static_url_path = "/cabinet/static",
    static_folder = "static",
    template_folder = "templates"
)