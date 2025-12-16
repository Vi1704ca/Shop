let openBtn = document.getElementById("open-cart");
let modal = document.getElementById("cart-modal");
let frame = document.getElementById("cart-frame");
let closeBtn = document.getElementById("close-cart");
let continueBtn = document.querySelector(".continue_shopping");

document.addEventListener("DOMContentLoaded", function() {
    function closeCart(){
        try{
            window.parent.postMessage({type:"close-cart"}, "*");
        } catch (e) {
            try { window.top.postMessage({type:"close-cart"}, "*"); } catch (error) {}
        }
    }
    if (closeBtn){
        closeBtn.addEventListener("click", closeCart);
    }
    if (continueBtn){ 
        continueBtn.addEventListener("click", closeCart);
    }
});

openBtn.addEventListener("click", () => {
    if (modal.classList.contains("active")) {
        modal.classList.remove("active");
        frame.src = "";
    } else {
        frame.src = "/cart";
        modal.classList.add("active");
    }
});
window.addEventListener('message', (event) => {
    const data = event && event.data;
    if (!data) return;
    if (data.type === 'close-cart') {
        modal.classList.remove('active');
        frame.src = '';
    }
});