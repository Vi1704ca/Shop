import flask
from shop.models import Product
from Project.config_page import config_page

@config_page(rule_name='drone.html')
def render_drone():
    target_ids = [8, 1, 2, 3] 
    
    list_product = []
    for product_id in target_ids:
        product = Product.query.get(product_id)
        if product:
            list_product.append(product)

    return {
        'list_product': list_product,  
    }

def render_thermalI():
    return flask.render_template('thermalI.html')