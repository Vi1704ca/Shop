const USER_STATUSES = [
    "authorization",
    "registration",
    "registration-success",
    "forgot-password",
    "new-password",
    "password-reset-success"
];

document.addEventListener("DOMContentLoaded", function () {
    const isIframe = window.self !== window.top;
    
    if (isIframe) {
        initIframeLogic();
    } else {
        initParentLogic();
    }
});

function initIframeLogic() {
    const sendEmailBtn = document.querySelector('.send_an_email');
    const savePasswordBtn = document.querySelector('.save_password');
    const loginFinalBtn = document.querySelector('.save_password_final');
    const cancelBtns = document.querySelectorAll('.cancel');
    const closeBtns = document.querySelectorAll('#close-user, #close-cart');
    
    const passwordResetBlock = document.querySelector('.password_reset');
    const newPasswordBlock = document.querySelector('.new-password');
    const passwordResetFinalBlock = document.querySelector('.password_reset_final');
    
    function notifyParentStatus(status) {
        window.parent.postMessage({ type: "user-status", status: status }, "*");
    }
    
    function notifyCloseUser() {
        window.parent.postMessage({ type: "close-user" }, "*");
    }
    
    function notifyCloseCart() {
        window.parent.postMessage({ type: "close-cart" }, "*");
    }
    
    function hideAllBlocks() {
        [passwordResetBlock, newPasswordBlock, passwordResetFinalBlock].forEach(block => {
            if (block) block.style.display = 'none';
        });
    }
    
    function checkForRegistrationSuccess() {
        const successIndicators = [
            document.querySelector('.success-message'),
            document.querySelector('.registration-success'),
            document.querySelector('.success-registration'),
            
            document.querySelector('[data-registration-success="true"]'),
            document.querySelector('[data-status="success"]'),
            
            () => {
                const bodyText = document.body.innerText;
                return bodyText.includes('Успешная регистрация') || 
                       bodyText.includes('Регистрация успешна');
            }
        ];
        
        let hasSuccess = false;
        
        successIndicators.forEach(indicator => {
            if (typeof indicator === 'function') {
                if (indicator()) hasSuccess = true;
            } else if (indicator && indicator.offsetParent !== null) {
                hasSuccess = true;
            }
        });
        
        if (hasSuccess) {
            setTimeout(() => {
                notifyParentStatus('registration-success');
            }, 100);
        }
        
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('registration_success') || 
            urlParams.has('success') || 
            window.location.hash.includes('success')) {
            setTimeout(() => {
                notifyParentStatus('registration-success');
            }, 50);
        }
    }
    
    function sendInitialStatus() {
        const url = window.location.pathname;
        let currentStatus = USER_STATUSES.find(st => url.includes(st));
        
        if (url.includes('registration')) {
            checkForRegistrationSuccess();
        }
        
        if (currentStatus) {
            notifyParentStatus(currentStatus);
        }
    }
    
    function sendCartStatus() {
        const items = document.querySelectorAll(".cart-item").length;
        window.parent.postMessage({ type: "cart-status", empty: items === 0 }, "*");
    }

    if (sendEmailBtn) {
        sendEmailBtn.addEventListener('click', () => {
            if (newPasswordBlock) { 
                hideAllBlocks(); 
                newPasswordBlock.style.display = 'block'; 
            }
            notifyParentStatus('new-password');
        });
    }
    
    if (savePasswordBtn) {
        savePasswordBtn.addEventListener('click', () => {
            if (passwordResetFinalBlock) { 
                hideAllBlocks(); 
                passwordResetFinalBlock.style.display = 'block'; 
            }
            notifyParentStatus('password-reset-success');
        });
    }
    
    cancelBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const path = window.location.pathname;
            if (path.includes('authorization') || path.includes('registration')) {
                notifyCloseUser();
            } else {
                if (passwordResetBlock) { 
                    hideAllBlocks(); 
                    passwordResetBlock.style.display = 'block'; 
                }
                notifyParentStatus('forgot-password');
            }
        });
    });
    
    closeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (btn.id === 'close-cart') {
                notifyCloseCart();
            } else {
                notifyCloseUser();
            }
        });
    });
    
    if (loginFinalBtn) {
        loginFinalBtn.addEventListener('click', notifyCloseUser);
    }
    
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' || mutation.type === 'attributes') {
                checkForRegistrationSuccess();
            }
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'style', 'data-*']
    });
    
    sendInitialStatus();
    sendCartStatus();
    document.addEventListener("cart-updated", sendCartStatus);
}

function initParentLogic() {
    const modalCart = document.getElementById("cart-modal");
    const frameCart = document.getElementById("cart-frame");
    const modalUser = document.getElementById("user-modal");
    const frameUser = document.getElementById("user-frame");
    
    const openCartBtn = document.getElementById("open-cart");
    const closeCartBtn = document.getElementById("close-cart");
    const openUserBtns = document.querySelectorAll("#open-user");
    const continueBtn = document.querySelector(".continue_shopping");
    
    function setUserModalStatus(status) {
        if (!modalUser) return;
        USER_STATUSES.forEach(st => modalUser.classList.remove(st));
        
        if (status) {
            modalUser.classList.add(status);
            adjustIframeHeight(status);
        }
    }
    
    function adjustIframeHeight(status) {
        const iframe = modalUser.querySelector('iframe');
        if (!iframe) return;
        
        if (status === 'registration-success' || status === 'password-reset-success') {
            iframe.style.height = '32vh';
            iframe.classList.add('success-state-height');
        } else {
            iframe.style.height = '';
            iframe.classList.remove('success-state-height');
        }
    }
    
    function closeCart() {
        if (modalCart) {
            modalCart.classList.remove("active");
            setTimeout(() => { 
                if (frameCart) frameCart.src = ""; 
            }, 300);
        }
    }
    
    function closeUser() {
        if (modalUser) {
            modalUser.classList.remove("active");
            setTimeout(() => { 
                if (frameUser) frameUser.src = ""; 
            }, 300);
            setUserModalStatus(null);
        }
    }
    
    if (openCartBtn) {
        openCartBtn.addEventListener("click", (e) => {
            e.preventDefault();
            if (modalCart?.classList.contains("active")) {
                closeCart();
            } else {
                closeUser();
                if (frameCart) frameCart.src = "/cart";
                modalCart?.classList.add("active");
            }
        });
    }
    
    openUserBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            if (modalUser?.classList.contains("active")) {
                closeUser();
            } else {
                closeCart();
                if (frameUser) frameUser.src = "/forgot-password";
                modalUser?.classList.add("active");
            }
        });
    });
    
    if (closeCartBtn) {
        closeCartBtn.addEventListener("click", (e) => {
            e.preventDefault();
            closeCart();
        });
    }
    
    if (continueBtn) {
        continueBtn.addEventListener("click", (e) => {
            e.preventDefault();
            closeCart();
        });
    }
    
    window.addEventListener("message", (event) => {
        const data = event.data;
        if (!data) return;
        
        switch (data.type) {
            case "close-user":
                closeUser();
                break;
                
            case "close-cart":
                closeCart();
                break;
                
            case "user-status":
                setUserModalStatus(data.status);
                break;
                
            case "cart-status":
                if (modalCart) {
                    modalCart.classList.toggle("empty", data.empty);
                    modalCart.classList.toggle("filled", !data.empty);
                }
                break;
        }
    });
    
    function initInitialState() {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('show') && urlParams.get('show') === 'registration-success') {
            setUserModalStatus('registration-success');
        }
    }
    
    initInitialState();
}