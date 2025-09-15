import flask_migrate
import flask_sqlalchemy
import os 
from .settings import project

project.config["SQLALCHEMY_DATABASE_URI"] = 'sqlite:///data.db'

project.app_context().push()

DATABASE = flask_sqlalchemy.SQLAlchemy(app = project)
MIGRATE = flask_migrate.Migrate(
    app = project,
    db = DATABASE,
    directory = os.path.abspath(os.path.join(__file__, "..", "migrations"))
)