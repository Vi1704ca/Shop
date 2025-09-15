import flask
from Project.config_page import config_page
from shop.models import Product

@config_page(template_name= 'cart.html')
def render_cart():
    # 
    list_products = [] #
    cookies = flask.request.cookies.get(key= 'list_products')
    if cookies:
        list_id_product = cookies.split('|')# list_id_product = ["", '1', '2', '3']
        for id in list_id_product:
            # 
            if id != '':
                count_id = list_id_product.count(id)
                # 
                product: Product = Product.query.get(ident= id)
                # 
                if [product, count_id] not in list_products:
                    # 
                    list_products.append([product, count_id]) 
    # 
    return {'list_products': list_products}

def delete_product_to_cart():
    if flask.request.method == 'POST':
        # 
        id_product = flask.request.form.get(key= "delete") # 1
        cookies = flask.request.cookies.get(key = "list_products").replace(f"|{id_product}|", '')
        # cookies = "1|1|1|2|2|2".replace("1|", "") = "2|2|2"
          
        response= flask.make_response(flask.redirect('/cart'))
        response.set_cookie(key= 'list_products', value= cookies)
        
        return response
        