let cartItemsCount = 0;


function updateCartDisplay() {
    const countElement = document.querySelector('.VAY');
    if (!countElement) return;
    
    if (cartItemsCount > 0) {
        countElement.style.visibility = 'visible';
        countElement.textContent = cartItemsCount;
    } else {
        countElement.style.visibility = 'hidden';
        countElement.textContent = '0';
    }
}

function addToCart(productId) {
    let currentProducts = '';
    const cookies = document.cookie.split(';');
    
    for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.startsWith('list_products=')) {
            currentProducts = cookie.split('=')[1];
            break;
        }
    }
    
    if (!currentProducts) {
        document.cookie = `list_products=|${productId}|; path=/`;
        cartItemsCount = 1;
    } else {
        document.cookie = `list_products=${currentProducts}|${productId}|; path=/`;
        cartItemsCount++;
    }
    
    updateCartDisplay();
}

document.addEventListener('DOMContentLoaded', function() {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.startsWith('list_products=')) {
            const productsString = cookie.split('=')[1];
            if (productsString && productsString !== '') {
                const products = productsString.split('|').filter(product => product !== '');
                cartItemsCount = products.length;
            }
            break;
        }
    }
    
    updateCartDisplay();

    const listButton = document.querySelectorAll('.cart-buy');
    listButton.forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault();
            addToCart(this.id);
        });
    });
});