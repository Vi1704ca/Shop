import flask 

cart = flask.Blueprint(
    name= "cart",
    import_name= "cart",
    static_url_path= "/cart/static",
    static_folder= "static",
    template_folder="templates"
) 