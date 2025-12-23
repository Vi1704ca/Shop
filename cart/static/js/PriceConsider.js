export function recalcCart() {
    let totalOriginal = 0;
    let totalDiscount = 0;

    document.querySelectorAll('.cart-item').forEach(item => {
        const count = Number(item.querySelector('#amount')?.textContent || 0);
        if (!count) return;
        
        const parsePrice = el => Number(el?.textContent.replace(/\D/g, '') || 0);
        
        const originalPrice = parsePrice(item.querySelector('.old-price, .current-price'));
        const discountPrice = parsePrice(item.querySelector('.new-price')) || originalPrice;

        totalOriginal += originalPrice * count;
        totalDiscount += discountPrice * count;
    });

    document.getElementById('total-original').textContent = `${totalOriginal.toLocaleString('uk-UA')}  ₴`;
    document.getElementById('total-discount').textContent =`${totalDiscount.toLocaleString('uk-UA')}  ₴`;
    document.getElementById('total-saved').textContent = `- ${(totalOriginal - totalDiscount).toLocaleString('uk-UA')}  ₴`;
}

document.addEventListener('DOMContentLoaded', () => {
    recalcCart();
});
