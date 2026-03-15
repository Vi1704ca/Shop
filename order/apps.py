import flask

order = flask.Blueprint(
    name = "order",
    import_name = "order",
    static_url_path = "/order/static",
    static_folder= "static",
    template_folder="templates"
)
