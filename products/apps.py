import flask

products = flask.Blueprint(
    name = "products",
    import_name = "products",
    static_url_path = "/products/static",
    static_folder= "static",
    template_folder="templates"
)