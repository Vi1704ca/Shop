import flask 
import os

project = flask.Flask(
    import_name = "Project",
    static_url_path = "/static",
    template_folder = "templates",
    static_folder = "static",
    instance_path = os.path.abspath(os.path.join(__file__, "..", "instance"))
)