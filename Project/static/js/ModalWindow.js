let openBtn = document.getElementById("open-cart");
let modal = document.getElementById("cart-modal");
let frame = document.getElementById("cart-frame");
let closeBtn = document.getElementById("close-cart");
let continueBtn = document.querySelector(".continue_shopping");
let isIframe = window.self !== window.top;


function closeCart() {
    try {
        window.parent.postMessage({type:"close-cart"}, "*");
    } catch (e) {
        try { 
            window.top.postMessage({type:"close-cart"}, "*"); 
        } catch (error) {}
    }
}

document.addEventListener("DOMContentLoaded", function() {
    if (closeBtn){
        closeBtn.addEventListener("click", closeCart);
    }
    if (continueBtn){ 
        continueBtn.addEventListener("click", closeCart);
    }
    
    if (isIframe) {
        function sendCartStatus() {
            const items = document.querySelectorAll(".cart-item").length;
            const isEmpty = items === 0;
            
            try {
                window.parent.postMessage({
                    type: "cart-status",
                    empty: isEmpty
                }, "*");
            } catch (e) {}
        }
        
        sendCartStatus();
        document.addEventListener("cart-updated", sendCartStatus);
    }
    
    else {
        openBtn.addEventListener("click", () => {
            if (modal.classList.contains("active")) {
                modal.classList.remove("active");
                frame.src = "";
            } else {
                frame.src = "/cart";
                modal.classList.add("active");
            }
        });
        
        window.addEventListener("message", (event) => {
            const data = event && event.data;
            if (!data) return;
            
            if (data.type === 'close-cart') {
                modal.classList.remove('active');
                frame.src = '';
            }
            
            if (data.type === "cart-status") {
                modal.classList.toggle("empty", data.empty);
                modal.classList.toggle("filled", !data.empty);
            }
        });
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