let openBtn = document.getElementById("open-cart");
let modal = document.getElementById("cart-modal");
let frame = document.getElementById("cart-frame");
let closeBtn = document.getElementById("close-cart");
let continueBtn = document.querySelector(".continue_shopping");
let catalogfooterBtn = document.getElementById("catalog");

let isIframe = window.self !== window.top;

let openUserBtn = document.querySelectorAll("#open-user"); 
let userModal = document.getElementById("user-modal");
let userFrame = document.getElementById("user-frame"); 
let closeUserBtn = document.querySelectorAll("#close-user");

const USER_STATUSES = [
    "authorization",
    "registration",
    "registration-success",
    "forgot-password",
    "new-password",
    "password-reset-success"
];

function removeAllUserStatuses() {
    USER_STATUSES.forEach(status => userModal.classList.remove(status));
}

function setUserStatus(status) {
    removeAllUserStatuses();
    if (status) {
        userModal.classList.add(status);
    }
} 

function closeCart() {
    try {
        window.parent.postMessage({type:"close-cart"}, "*");
    } catch (e) {
        try { 
            window.top.postMessage({type:"close-cart"}, "*"); 
        } catch (error) {}
    }
}

function closeUser() {
    try {
        window.parent.postMessage({type:"close-user"}, "*");
    } catch (e) {
        try { 
            window.top.postMessage({type:"close-user"}, "*"); 
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
    if (closeUserBtn){
        closeUserBtn.forEach(btn => {
            btn.addEventListener("click", closeUser);
        });
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
        
        function sendUserStatus() {
            const url = window.location.pathname;
            let status = "";
            
            USER_STATUSES.forEach(st => {
                if (url.includes(st)) status = st;
            });
            
            if (status) {
                try {
                    window.parent.postMessage({
                        type: "user-status",
                        status: status
                    }, "*");
                } catch (e) {}
            }
        }
        
        sendCartStatus();
        sendUserStatus(); 
        
        document.addEventListener("cart-updated", sendCartStatus);
    }
    
    else {
        openBtn.addEventListener("click", () => {
            if (modal.classList.contains("active")) {
                modal.classList.remove("active");
                frame.src = "";
            } else {
                if (userModal.classList.contains("active")) {
                    userModal.classList.remove("active");
                    userFrame.src = "";
                }
                frame.src = "/cart";
                modal.classList.add("active");
            }
        });
        
        if (openUserBtn) {
            openUserBtn.forEach(openUserBtn => {
                openUserBtn.addEventListener("click", () => {
                   if (userModal.classList.contains("active")) {
                       userModal.classList.remove("active");
                       userFrame.src = "";
                   } else {
                       if (modal.classList.contains("active")) {
                           modal.classList.remove("active");
                           frame.src = "";
                       }
                       userFrame.src = "/authorization";
                       userModal.classList.add("active");
                   }
               });
            });
        }
        
        window.addEventListener("message", (event) => {
            const data = event && event.data;
            if (!data) return;
            
            if (data.type === 'close-cart') {
                modal.classList.remove('active');
                frame.src = '';
            }
            
            if (data.type === 'close-user') { 
                userModal.classList.remove('active');
                userFrame.src = '';
                removeAllUserStatuses();
            }
            
            if (data.type === "cart-status") {
                modal.classList.toggle("empty", data.empty);
                modal.classList.toggle("filled", !data.empty);
            }
            
            if (data.type === "user-status") {
                setUserStatus(data.status);
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
    
    if (data.type === 'close-user') { 
        userModal.classList.remove('active');
        userFrame.src = '';
        removeAllUserStatuses();
    }
});

catalogfooterBtn.addEventListener("click", function() {
    window.location.href = "/shop";
});