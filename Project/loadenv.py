import os
import dotenv

ENV_PATH = os.path.abspath(os.path.join(__file__, "..", "..", ".env"))
MIGRATIONS_PATH = os.path.abspath(os.path.join(__file__, "..", "migrations"))

def execute():
    if os.path.exists(path= ENV_PATH):
        dotenv.load_dotenv(dotenv_path= ENV_PATH)

        if not os.path.exists(path= MIGRATIONS_PATH):
            os.system(os.environ["DB_INIT"])

        os.system(os.environ["DB_MIGRATE"])
        os.system(os.environ["DB_UPGRADE"])