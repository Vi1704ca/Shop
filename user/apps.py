import flask

user = flask.Blueprint(
    name= 'user',
    import_name= 'user',
    static_folder= 'static',
    static_url_path= '/user/static',
    template_folder= 'templates'
)