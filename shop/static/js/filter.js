$(document).ready(function () {
    $('.sorting .all-select').addClass('active');
    const savedPage = localStorage.getItem('shop_selected_page');
    console.debug('[filter.js] savedPage on load:', savedPage);
    if (savedPage) {
        $('.page-number').each(function () {
            if ($(this).text().trim() === savedPage) {
                $(this).addClass('active');
            } else {
                $(this).removeClass('active');
            }
        });
    } else {
        $('.page-number').removeClass('active');
        $('.page-number').first().addClass('active');
    }
    $('.sorting button').on('click', function () {
        $('.sorting button').removeClass('active');
        $(this).addClass('active');
        let type = $(this).data('type');

        $.ajax({
            contentType: 'application/json',
            url: '/shop/filter',
            type: 'POST',
            data: JSON.stringify({ type_product: type }),
            success: function (response) {
                $("#products").empty();
                
                for (let product of response['products']) {
                    let productCard = $('<div>', { 
                        id: `product-${product.product_id}`, 
                        class: 'product-card'
                    });

                    productCard.append($('<img>', {
                        src: `/shop/static/images/products/${product.product_name}.png`,
                        width: "32vh",
                        height: '32vh',
                        class: 'product-image',
                        alt: product.product_name 
                    }));
                    
                    productCard.append($('<p>', { 
                        text: product.product_name, 
                        class: 'product_name' 
                    }));
                    
                    productCard.append($('<p>', { 
                        text: `$${product.product_price}`,
                        class: 'product_price' 
                    }));

                    productCard.append(
                        $('<button>', {
                            class: 'cart-buy',
                            id: product.id
                        }).append(
                            $('<img>', {
                                src: `/shop/static/images/icon/cart-img.svg`,
                                class: 'img-cart',
                            })
                        )
                    );

                    if (response['is_admin']) {
                        productCard.append(
                            $("<a>", { 
                                text: "DELETE", 
                                href: `/delete_product?id=${product.product_id}`,
                                class: 'delete-btn' 
                            })
                        );
                    }

                    $("#products").append(productCard);
                }
            }
        });
    });

    // это не фильтрация

    $('.page-number').on('click', function () {
        const page = $(this).text().trim();
        console.debug('[filter.js] page-number clicked:', page);
        if (!page) return;
        localStorage.setItem('shop_selected_page', page);
        localStorage.setItem('shop_scroll_to_products', '1');
        location.reload();
    });

    function getCurrentPage() {
        const saved = localStorage.getItem('shop_selected_page');
        if (saved) return parseInt(saved, 10) || 1;
        const active = $('.page-number.active').first().text().trim();
        return parseInt(active, 10) || 1;
    }

    function getMaxPage() {
        const count = $('.page-number').length;
        return count > 0 ? count : 7;
    }

    function updateNavIcons(page) {
        const max = getMaxPage();
        if (page > 1) {
            $('.page-return img').css('opacity', '1');
        } else {
            $('.page-return img').css('opacity', '0.5');
        }
        if (page < max) {
            $('.page-next img').css('opacity', '1');
        } else {
            $('.page-next img').css('opacity', '0.5');
        }
    }

    const initialPage = getCurrentPage();
    console.debug('[filter.js] initialPage:', initialPage, 'maxPage:', getMaxPage());
    updateNavIcons(initialPage);

    const shouldScroll = localStorage.getItem('shop_scroll_to_products');
    console.debug('[filter.js] shouldScroll flag:', shouldScroll);
    if (shouldScroll) {
        const target = document.getElementById('products');
        if (target) {
            console.debug('[filter.js] scrolling to #products');
            setTimeout(() => {
                try {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } catch (e) {
                    console.error('[filter.js] scrollIntoView failed, fallback', e);
                    window.scrollTo(0, target.offsetTop || 0);
                }
            }, 60);
        } else {
            console.debug('[filter.js] #products not found in DOM');
        }
        localStorage.removeItem('shop_scroll_to_products');
    }

    $('.page-return').on('click', function () {
        let page = getCurrentPage();
        console.debug('[filter.js] page-return clicked, current:', page);
        if (page > 1) {
            page = page - 1;
            console.debug('[filter.js] navigate to page:', page);
            localStorage.setItem('shop_selected_page', String(page));
            localStorage.setItem('shop_scroll_to_products', '1');
            location.reload();
        }
    });

    $('.page-next').on('click', function () {
        let page = getCurrentPage();
        const max = getMaxPage();
        console.debug('[filter.js] page-next clicked, current:', page, 'max:', max);
        if (page < max) {
            page = page + 1;
            console.debug('[filter.js] navigate to page:', page);
            localStorage.setItem('shop_selected_page', String(page));
            localStorage.setItem('shop_scroll_to_products', '1');
            location.reload();
        }
    });
});