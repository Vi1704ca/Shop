import flask 

shop = flask.Blueprint(
       name= "shop",
       import_name= "shop",
       static_url_path= "/shop/static",
       static_folder= "static",
       template_folder="templates"
) 