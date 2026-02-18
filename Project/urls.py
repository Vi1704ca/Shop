import home, shop, user, cart, about_us

home.home.add_url_rule(rule = '/', view_func = home.render_home)
cart.cart.add_url_rule(rule = '/cart', view_func = cart.render_cart)
about_us.about_us.add_url_rule(rule = '/about-us', view_func = about_us.render_about_us)
# cart.cart.add_url_rule(rule = '/delete_product_to_cart', view_func = cart.delete_product_to_cart, methods = ['GET','POST'])
user.user.add_url_rule(rule = '/agreement-reset-password', view_func=user.agreement_reset_password)

user.user.add_url_rule(
    rule = '/registration',
    view_func = user.render_registration,
    methods = ['GET','POST']
)

user.user.add_url_rule(
    rule = "/authorization",
    view_func = user.render_authorization,
    methods = ['GET','POST']
)

user.user.add_url_rule(
    rule = "/forgot-password",
    view_func = user.email_password,
    methods = ['GET','POST']
)

user.user.add_url_rule(
    rule = "/logout",
    view_func = user.logout

)
shop.shop.add_url_rule(
    rule ="/shop",
    view_func = shop.render_shop,
    methods = ['GET','POST']
)
# shop.shop.add_url_rule(
#     rule ="/delete_product",
#     view_func = shop.delete_product
# )

shop.shop.add_url_rule(
    rule ="/buy",
    view_func = shop.add_product_id_cookies
)
shop.shop.add_url_rule(
    rule ="/shop/filter",
    view_func = shop.filter,
    methods = ['GET','POST']
)
shop.shop.add_url_rule(
    rule = "/shop/delete",
    view_func = shop.delete,
    methods = ["GET", "POST"]
)

