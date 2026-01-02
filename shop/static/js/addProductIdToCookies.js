/**
 * Селектори 
 * class - селектор . 
 * id - селектор #
 * змінні в Python: listButton = значення
 * змінні js:
 * let - глобальна або локальна змінна 
 * var - застарілий спосіб 
 * const - незмінне значення
 */
// const listButton = document.querySelectorAll('.buy')
/**
 * Python: 
 * for el in listButton:
 *    тіло циклу
 * 
 * JS, а також С++, С#, JAVA:
 * for (){
 *     тіло циклу
 * }
 */
// for (let count= 0; count < listButton.length; count++){
//     let button = listButton[count]
//     button.addEventListener(
//         type= 'click',
        /**
         * In python:
         * 1. def name_function(parametr):
         *      pass
         * 2. lambda (parametr)
         * In JS:
         * 1. function (){} - анонімна функція
         * 2. function name(){} - іменована функція
         * 3. () => {} - стрілочна функція
         */
        // listener= function (event){
            /**
             * In python:
             * if умова:
             * In JS:
             * if (умова){}
             */
            // if (document.cookie == ''){
                /**
                 * Динамічні рядки 
                 * In python: 
                 * f"{}"
                 * In JS:
                 * `${}`
                 */
//                 document.cookie = `list_products = ${button.id}; path = /`
//             }
//             else{
//                 listIdProduct = document.cookie.split('=')[1]
//                 document.cookie = `list_products = ${listIdProduct} ${button.id}; path = /`
//             }
//         }
//     )
// }

const listButton = document.querySelectorAll('.cart-buy')

//for (let count= 0; count < listButton.length; count++){
//    let button = listButton[count]
//    button.addEventListener(
//        type= 'click',
//        listener= function (event){
//            listIdProduct = document.cookie.split('=')[1]
//            if (document.cookie == '' || !listIdProduct){
//                document.cookie = `list_products = |${button.id}|; path = /`
//            }else{
//                document.cookie = `list_products = ${listIdProduct}|${button.id}|; path = /`
//            }
//        }
//    )
//}


document.addEventListener('DOMContentLoaded', function () {
    const notification = document.querySelector('.notification');
    const counter = document.querySelector('.VAY');

    function showNotification() {
        if (!notification) return;

        // clear inline display if present so CSS classes control visibility
        notification.style.display = '';

        // restart animations if already showing
        notification.classList.remove('hide');
        // Force reflow to restart animation if needed
        void notification.offsetWidth;
        notification.classList.add('show');

        // After visible duration, start hide animation
        setTimeout(() => {
            notification.classList.remove('show');
            notification.classList.add('hide');
        }, 3000);
    }

    // When hide animation ends, fully hide the element (remove classes and set display none)
    if (notification) {
        notification.addEventListener('animationend', (e) => {
            // Only act on our out animation
            if (e.animationName === 'notification-out' && notification.classList.contains('hide')) {
                notification.classList.remove('hide');
                // ensure it's removed from flow
                notification.style.display = 'none';
            }
        });
    }

    function getProductsFromCookie() {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            cookie = cookie.trim();
            if (cookie.startsWith('list_products=')) {
                const value = cookie.split('=')[1];
                return value ? value.split('|').filter(Boolean) : [];
            }
        }
        return [];
    }

    function updateCounter() {
        if (!counter) return;
        const products = getProductsFromCookie();
        counter.textContent = products.length;
        counter.style.visibility = products.length > 0 ? 'visible' : 'hidden';
    }

    document.addEventListener('click', function (e) {
        if (!e.target.closest('.cart-buy')) return;

        e.preventDefault();
        const button = e.target.closest('.cart-buy');
        const productId = button.id;
        if (!productId) return;

        let current = '';
        const cookies = document.cookie.split(';');

        for (let cookie of cookies) {
            cookie = cookie.trim();
            if (cookie.startsWith('list_products=')) {
                current = cookie.split('=')[1];
                break;
            }
        }

        document.cookie = `list_products=${current || '|'}|${productId}|; path=/`;
        updateCounter();
        showNotification();
        document.getElementById("cart-frame").contentWindow.location.reload()
    });

    let lastCount = getProductsFromCookie().length;
    setInterval(() => {
        const newCount = getProductsFromCookie().length;
        if (newCount !== lastCount) {
            lastCount = newCount;
            updateCounter();
        }
    }, 50);

    updateCounter();
});
