// 
$(document).ready(function (){
    $("#filter").on('click',function (){
        $.ajax({
            contentType: 'application/json',
            url: '/shop/filter',
            type: 'post',
            data: $("#select").val(),
            success: function (response){
                // очищуємо контент тегу всіх продуктів 
                $("#products").empty()
                // $() - селектор jQuery
                // $('<div>') - створення тегу div
                // $('<div>', {id: 'product'}) - задаємо атрибути для тегу div
                for (let product of response['products']){
                    let productDiv = $('<div>', {id: `product-${product.product_id}`})

                    productDiv.append($('<hr>'))
                    productDiv.append($('<img>', {src: `/shop/static/images/products/${product.product_name}.png`, width: "200px", height: '200px'}))
                    productDiv.append($('<p>', {text: `Назва продукту: ${product.product_name}`}))
                    productDiv.append($('<p>', {text: `Вартість продукту: ${product.product_price}`}))
                    productDiv.append($('<p>', {text: `Знижка на одиницю продукту: ${product.product_discount}`}))
                    productDiv.append($('<p>', {text: `Кількість продукту: ${product.product_count}`}))
                    productDiv.append($('<p>', {text: `Опис продукту: ${product.product_description}`}))
                    productDiv.append($('<button>', {text: "BUY", type: "button", class: "buy", id: `${product.product_id}`}))
                    
                    if (response['is_admin']){
                        productDiv.append($("<a>", {text: "DELETE", href: `/delete_product?id=${product.product_id}`}))
                    }
                    productDiv.append($('<hr>'))
                    // Працюємо тут, додаємо всю інформацію по продукту
                    $("#products").append(productDiv) 
                }
            }
        })
    })  
    // Видалення продукту через AJAX
})
