import flask

home = flask.Blueprint(
    name= 'home',
    import_name= 'home',
    static_folder= 'static',
    static_url_path= '/home/static',
    template_folder= 'templates'
)