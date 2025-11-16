$(document).ready(function () {
    $('.sorting button').on('click', function () {
        let type = $(this).data('type'); // сразу получаем тип продукта

        $.ajax({
            contentType: 'application/json',
            url: '/shop/filter',
            type: 'POST',
            data: JSON.stringify({ type_product: type }),
            success: function (response) {
                $("#products").empty();
                for (let product of response['products']) {
                    let productDiv = $('<div>', { id: `product-${product.product_id}`, class: 'product-item' });

                    productDiv.append($('<img>', {
                        src: `/shop/static/images/products/${product.product_name}.png`,
                        width: "200px",
                        height: '200px'
                    }));
                    productDiv.append($('<p>', { text: product.product_name, class: 'product_name' }));
                    productDiv.append($('<p>', { text: product.product_price, class: 'product_price' }));

                    if (response['is_admin']) {
                        productDiv.append($("<a>", { text: "DELETE", href: `/delete_product?id=${product.product_id}` }));
                    }

                    $("#products").append(productDiv);
                }
            }
        });
    });
});
