from Project.db import DATABASE
from flask_login import UserMixin

class User(DATABASE.Model, UserMixin):
    
    id = DATABASE.Column(DATABASE.Integer, primary_key = True)
    
    username = DATABASE.Column(DATABASE.String(50), nullable = False)
    email = DATABASE.Column(DATABASE.String(50), nullable = False)
    password = DATABASE.Column(DATABASE.String(25), nullable = False)
    
    is_admin = DATABASE.Column(DATABASE.Boolean, default = False)
    
