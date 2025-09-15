import flask, flask_login
from .models import Product
from os.path import abspath, join
import os, traceback

from Project.db import DATABASE
from Project.config_page import config_page

from .admin import is_admin

@config_page(template_name= 'shop.html')
def render_shop():
    message = ''
    # 
    type = flask.request.args.get('type')
    # 
    list_products = Product.query.all()
    list_types = []
    # 
    for product in list_products:
        if product.type_product not in list_types:
            list_types.append(product.type_product)
    # 
    if flask.request.method == 'POST':
        if type == 'add':
            product_name_form = flask.request.form["product_name"]
            product_name_model = Product.query.filter_by(product_name = product_name_form).first()
            
            if product_name_model is None:
                product = Product(
                    product_name = product_name_form,
                    price= flask.request.form["price"],
                    discount = flask.request.form["discount"],
                    count= flask.request.form["count"],
                    description= flask.request.form["description"]
                )
                DATABASE.session.add(product)
                DATABASE.session.commit()
                
                image = flask.request.files['image']
                image.save(dst= abspath(join(__file__, "..", "static", "images", "products", f"{product_name_form}.png")))
                
                message = "Продукт успішно додано"
            else:
                message = "Продукт з таокю назвою вже існує"
        elif type == 'filter':
            type_product_form = flask.request.form['type_product']
            if type_product_form != 'all':
                list_products = Product.query.filter_by(type_product = type_product_form)
            else:
                list_products = Product.query.all()
    return {
        'message': message,
        'list_product': list_products,
        'list_types': list_types
    }
    
@is_admin(redirect_url= '/shop')
def delete_product():
    product_id = int(flask.request.args.get('id'))
    model_product : Product = Product.query.get(product_id) # object_sqlite_product | None
    
    if model_product is not None:
        DATABASE.session.delete(model_product)
        DATABASE.session.commit()
        os.remove(path= abspath(join(__file__, "..", "static", "images", "products", f"{model_product.product_name}.png")))
        

def add_product_id_cookies():
    try:
        # Отримуємо по запросу користувача id продукту, який додамо до cookie файлів
        product_id = flask.request.args.get(key= 'id') # str = 1
        # Отримуємо від запита клієнта cookie-файл з назвою 'list_products', якщо така назва там є
        list_products_id = flask.request.cookies.get(key= 'list_products') # якщо list_products не існує то None інакше str = '1'
        # Створюємо об'єкт для відповіді клієнту 
        response = flask.make_response(flask.redirect('/shop'))
        # Якщо cookie-файл з назвою 'list_products' не порожній
        if list_products_id is not None:
            # list_products_id = list_products_id + ' ' + product_id
            list_products_id += ' ' + product_id # str = '1 1'
            # Записуємо до відповіді клієнту cookie-файл з назвою 'list_products'
            response.set_cookie(key= 'list_products', value= list_products_id)
        else:
            response.set_cookie(key= 'list_products', value= product_id)
        # Повертаємо клієнту підготовлену відповідь
        return response
    except Exception as ERROR:
        traceback.print_exc()
    finally:
        return response

        