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

const passwordResetBlock = document.querySelector('.password_reset');
const newPasswordBlock = document.querySelector('.new-password');
const passwordResetFinalBlock = document.querySelector('.password_reset_final');

function removeAllUserStatuses() {
    USER_STATUSES.forEach(status => userModal.classList.remove(status));
}

function setUserStatus(status) {
    removeAllUserStatuses();
    if (status) {
        userModal.classList.add(status);
        
        if (status === 'forgot-password') {
            hideAllPasswordBlocks();
            if (passwordResetBlock) passwordResetBlock.style.display = 'block';
        } else if (status === 'new-password') {
            hideAllPasswordBlocks();
            if (newPasswordBlock) newPasswordBlock.style.display = 'block';
        } else if (status === 'password-reset-success') {
            hideAllPasswordBlocks();
            if (passwordResetFinalBlock) passwordResetFinalBlock.style.display = 'block';
        }
    }
}

function hideAllPasswordBlocks() {
    if (passwordResetBlock) passwordResetBlock.style.display = 'none';
    if (newPasswordBlock) newPasswordBlock.style.display = 'none';
    if (passwordResetFinalBlock) passwordResetFinalBlock.style.display = 'none';
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
    hideAllPasswordBlocks();
}

function showPasswordReset() {
    hideAllPasswordBlocks();
    if (passwordResetBlock) {
        passwordResetBlock.style.display = 'block';
    }
}

function showNewPassword() {
    hideAllPasswordBlocks();
    if (newPasswordBlock) {
        newPasswordBlock.style.display = 'block';
    }
}

function showPasswordResetFinal() {
    hideAllPasswordBlocks();
    if (passwordResetFinalBlock) {
        passwordResetFinalBlock.style.display = 'block';
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
    
    const sendEmailBtn = document.querySelector('.send_an_email');
    if (sendEmailBtn) {
        sendEmailBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showNewPassword();
        });
    }
    
    const savePasswordBtn = document.querySelector('.save_password');
    if (savePasswordBtn) {
        savePasswordBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showPasswordResetFinal();
        });
    }
    
    const loginFinalBtn = document.querySelector('.save_password_final');
    if (loginFinalBtn) {
        loginFinalBtn.addEventListener('click', function() {
            closeUser();
        });
    }
    
    const cancelBtns = document.querySelectorAll('.cancel');
    cancelBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            showPasswordReset();
        });
    });
    
    const passwordCloseBtns = document.querySelectorAll('.close-password-reset, .close-password-reset-final');
    passwordCloseBtns.forEach(btn => {
        btn.addEventListener('click', closeUser);
    });
    
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
        if (openBtn) {
            openBtn.addEventListener("click", () => {
                if (modal.classList.contains("active")) {
                    modal.classList.remove("active");
                    frame.src = "";
                } else {
                    if (userModal.classList.contains("active")) {
                        userModal.classList.remove("active");
                        userFrame.src = "";
                        hideAllPasswordBlocks();
                    }
                    frame.src = "/cart";
                    modal.classList.add("active");
                }
            });
        }
        
        if (openUserBtn) {
            openUserBtn.forEach(openUserBtn => {
                openUserBtn.addEventListener("click", () => {
                   if (userModal.classList.contains("active")) {
                       userModal.classList.remove("active");
                       userFrame.src = "";
                       hideAllPasswordBlocks();
                   } else {
                       if (modal.classList.contains("active")) {
                           modal.classList.remove("active");
                           frame.src = "";
                       }
                       userFrame.src = "/authorization";
                       userModal.classList.add("active");
                       hideAllPasswordBlocks();
                   }
               });
            });
        }
        
        window.addEventListener("message", (event) => {
            const data = event && event.data;
            if (!data) return;
            
            if (data.type === 'close-cart') {
                if (modal) {
                    modal.classList.remove('active');
                    frame.src = '';
                }
            }
            
            if (data.type === 'close-user') { 
                if (userModal) {
                    userModal.classList.remove('active');
                    userFrame.src = '';
                    removeAllUserStatuses();
                    hideAllPasswordBlocks();
                }
            }
            
            if (data.type === "cart-status") {
                if (modal) {
                    modal.classList.toggle("empty", data.empty);
                    modal.classList.toggle("filled", !data.empty);
                }
            }
            
            if (data.type === "user-status") {
                setUserStatus(data.status);
            }
            
            if (data.type === "show-password-reset") {
                showPasswordReset();
            }
            
            if (data.type === "show-new-password") {
                showNewPassword();
            }
            
            if (data.type === "show-password-reset-final") {
                showPasswordResetFinal();
            }
        });
    }
    
    if (catalogfooterBtn) {
        catalogfooterBtn.addEventListener("click", function() {
            window.location.href = "/shop";
        });
    }
});

window.addEventListener('message', (event) => {
    const data = event && event.data;
    if (!data) return;
    
    if (data.type === 'close-cart') {
        if (modal) {
            modal.classList.remove('active');
            frame.src = '';
        }
    }
    
    if (data.type === 'close-user') { 
        if (userModal) {
            userModal.classList.remove('active');
            userFrame.src = '';
            removeAllUserStatuses();
            hideAllPasswordBlocks();
        }
    }
});