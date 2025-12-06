from Project.db import DATABASE

class Product(DATABASE.Model):
    
    id = DATABASE.Column(DATABASE.Integer, primary_key = True)
    
    product_name = DATABASE.Column(DATABASE.String(50), nullable = False)
    price = DATABASE.Column(DATABASE.Float, nullable = False)
    discount = DATABASE.Column(DATABASE.Float, nullable = True)
    count = DATABASE.Column(DATABASE.Float, nullable = False)
    #description = DATABASE.Column(DATABASE.String(450), nullable = False)
    type_product = DATABASE.Column(DATABASE.String(50), default = 'type')
