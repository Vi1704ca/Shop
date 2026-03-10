from Project.db import DATABASE

class Profile(DATABASE.Model):
    
    id = DATABASE.Column(DATABASE.Integer, primary_key = True)
    
    first_name = DATABASE.Column(DATABASE.String(50), nullable=False)
    last_name = DATABASE.Column(DATABASE.String(50), nullable=False)
    middle_name = DATABASE.Column(DATABASE.String(50), nullable=False)
    date_of_birth = DATABASE.Column(DATABASE.Date, nullable=False)
    phone_number = DATABASE.Column(DATABASE.String(20), nullable=False, unique=True)
    email = DATABASE.Column(DATABASE.String(120), unique=True, nullable=False)