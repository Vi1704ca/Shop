from Project.config_page import config_page
from shop.models import Product
from flask import request
import random

@config_page(rule_name='home.html')
def render_home():
    action = request.args.get('action')
    
    if action == 'agreement-reset-password':
        # Здесь можно провести валидацию токена, если он есть в URL
        # Например: token = request.args.get('token')
        print("Користувач перейшов за посиланням з email.")
    

    #products = Product.query.filter_by(type_product='drone').order_by(Product.product_name).all()
    
    #random.shuffle(products)
    #list_product = products[:4]  

    #for product in list_product:
    #    print(f"- {product.product_name} (Type: '{product.type_product}')")
    
    target_ids = [8, 1, 2, 3] 
    
    list_product = []
    for product_id in target_ids:
        product = Product.query.get(product_id)
        if product:
            list_product.append(product)
    
    #list_product = products[:4]  # берем до 4 продуктов

    return {
        'list_product': list_product,  
    }
