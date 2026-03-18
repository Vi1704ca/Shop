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
    const sendEmailBtn = document.querySelector('.send_email');
    const savePasswordBtn = document.querySelector('.save_password');
    const loginFinalBtn = document.querySelector('.save_password_final');
    const visitWebsiteBtn = document.querySelector('.visit-website');
    const cancelBtns = document.querySelectorAll('.cancel');
    const closeBtns = document.querySelectorAll('#close-user, #close-cart');
    const backBtn = document.getElementById('user-back');
    const forgotLink = document.querySelector('.forgot-link');
    
    const passwordResetBlock = document.querySelector('.password_reset');
    const newPasswordBlock = document.querySelector('.new-password');
    const passwordResetFinalBlock = document.querySelector('.password_reset_final');
    const authorizationBlock = document.querySelector('.authorization');
    
    let historyStack = ['authorization'];
    let currentStatus = 'authorization';
    
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
        const blocks = [
            passwordResetBlock, 
            newPasswordBlock, 
            passwordResetFinalBlock, 
            authorizationBlock,
            document.querySelector('.registration'),
            document.querySelector('.registration-success')
        ];
        blocks.forEach(block => {
            if (block) block.style.display = 'none';
        });
    }
    
    function showBlock(block, status, addToHistory = true) {
        hideAllBlocks();
        
        if (status === 'registration-success') {
            const registrationBlock = document.querySelector('.registration');
            if (registrationBlock) {
                registrationBlock.style.display = 'block';
            }
        } else if (block) {
            block.style.display = 'block';
        }
        
        currentStatus = status;
        if (addToHistory) {
            historyStack.push(status);
            console.log('History:', historyStack);
        }
        notifyParentStatus(status);
    }
    
    const currentUrl = window.location.href;
    
    function determineAndShowInitialBlock() {
        const successBlock = document.querySelector('.registration-success');

        if (successBlock) {
            const registrationBlock = document.querySelector('.registration');
            if (registrationBlock) {
                showBlock(registrationBlock, 'registration-success');
                historyStack = ['authorization', 'registration', 'registration-success'];
                return;
            }
        }

        if (currentUrl.includes('agreement-reset-password')) {
            showBlock(newPasswordBlock, 'new-password');
            historyStack = ['forgot-password', 'new-password'];
        } else if (currentUrl.includes('forgot-password')) {
            showBlock(passwordResetBlock, 'forgot-password');
            historyStack = ['forgot-password'];
        } else if (currentUrl.includes('new-password')) {
            showBlock(newPasswordBlock, 'new-password');
            historyStack = ['forgot-password', 'new-password'];
        } else if (currentUrl.includes('registration')) {
            const registrationBlock = document.querySelector('.registration');
            if (registrationBlock) {
                showBlock(registrationBlock, 'registration');
                historyStack = ['authorization', 'registration'];
            } else {
                showBlock(authorizationBlock, 'authorization');
                historyStack = ['authorization'];
            }
        } else {
            showBlock(authorizationBlock, 'authorization');
            historyStack = ['authorization'];
        }
    }
    
    function checkForRegistrationSuccess() {
        const registrationSuccessBlock = document.querySelector('.registration-success');
        const accountCreatedBlock = document.querySelector('.account-created');

        if (registrationSuccessBlock || accountCreatedBlock) {
            notifyParentStatus('registration-success');
            return true;
        }

        const bodyText = document.body.innerText;
        if (bodyText.includes('Акаунт успішно створено')) {
            notifyParentStatus('registration-success');
            return true;
        }
        return false;
    }
    
    const observer = new MutationObserver(function(mutations) {
        let shouldCheck = false;
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                shouldCheck = true;
            }
        });
        if (shouldCheck) {
            checkForRegistrationSuccess();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    if (backBtn) {
        backBtn.addEventListener('click', (e) => {
            e.preventDefault();

            if (historyStack.length > 1) {
                historyStack.pop();
                const previousStatus = historyStack[historyStack.length - 1];

                switch(previousStatus) {
                    case 'authorization':
                        showBlock(authorizationBlock, 'authorization', false);
                        break;
                    case 'forgot-password':
                        showBlock(passwordResetBlock, 'forgot-password', false);
                        break;
                    case 'new-password':
                        showBlock(newPasswordBlock, 'new-password', false);
                        break;
                    case 'password-reset-success':
                        showBlock(passwordResetFinalBlock, 'password-reset-success', false);
                        break;
                    case 'registration':
                        const registrationBlock = document.querySelector('.registration');
                        if (registrationBlock) {
                            showBlock(registrationBlock, 'registration', false);
                        }
                        break;
                    default:
                        showBlock(authorizationBlock, 'authorization', false);
                }
            } else {
                notifyCloseUser();
            }
        });
    }
    
    document.addEventListener('click', (e) => {
        if (e.target.closest('#close-user, .close-registration-complete, .close-password-reset, .close-password-reset-final')) {
            e.preventDefault();
            notifyCloseUser();
        }

        if (e.target.closest('.visit-website') || e.target.closest('.save_password_final')) {
            e.preventDefault();
            notifyCloseUser();
        }

        const registrationLink = e.target.closest('a[href="/registration"]');
        if (registrationLink) {
            e.preventDefault();
            window.parent.postMessage({ type: "load-registration" }, "*");
        }

        const authorizationLink = e.target.closest('a[href="/authorization"]');
        if (authorizationLink) {
            e.preventDefault();
            window.parent.postMessage({ type: "load-authorization" }, "*");
        }

        const forgotPasswordLink = e.target.closest('a[href="/forgot-password"]');
        if (forgotPasswordLink) {
            e.preventDefault();
            window.parent.postMessage({ type: "load-forgot-password" }, "*");
        }

        if (e.target.closest('.cancel')) {
            e.preventDefault();
            const btn = e.target.closest('.cancel');
            if (btn.id !== 'user-back') {
                if (currentStatus === 'forgot-password' ||
                    currentStatus === 'new-password' ||
                    currentStatus === 'password-reset-success' ||
                    currentStatus === 'registration-success') {
                    notifyCloseUser();
                } else if (currentStatus === 'registration') {
                    notifyCloseUser();
                } else {
                    notifyCloseUser();
                }
            }
        }
    });
    
    if (forgotLink) {
        forgotLink.addEventListener('click', (e) => {
            e.preventDefault();
            showBlock(passwordResetBlock, 'forgot-password');
        });
    }
    
    if (sendEmailBtn) {
        sendEmailBtn.addEventListener('click', () => {
            if (newPasswordBlock) { 
                showBlock(newPasswordBlock, 'new-password');
            }
        });
    }
    
    if (savePasswordBtn) {
        savePasswordBtn.addEventListener('click', () => {
            if (passwordResetFinalBlock) { 
                showBlock(passwordResetFinalBlock, 'password-reset-success');
            }
        });
    }
    
    cancelBtns.forEach(btn => {
        if (btn.id !== 'user-back') {
            btn.addEventListener('click', (e) => {
                e.preventDefault();

                if (currentStatus === 'forgot-password' || currentStatus === 'new-password' || currentStatus === 'password-reset-success') {
                    return;
                }

                const path = window.location.pathname;
                if (path.includes('authorization') || path.includes('registration')) {
                    notifyCloseUser();
                } else {
                    if (passwordResetBlock) { 
                        showBlock(passwordResetBlock, 'forgot-password');
                    }
                }
            });
        }
    });
    
    function sendInitialStatus() {
        const fullUrl = window.location.href;
        const urlParams = new URLSearchParams(window.location.search);

        let currentStatus = null;

        if (fullUrl.includes('agreement-reset-password') || urlParams.get('action') === 'agreement-reset-password') {
            currentStatus = 'new-password';
        } else if (window.location.pathname.includes('registration')) {
            currentStatus = 'registration';
        } else if (window.location.pathname.includes('forgot-password')) {
            currentStatus = 'forgot-password';
        } else if (window.location.pathname.includes('authorization')) {
            currentStatus = 'authorization';
        } else {
            currentStatus = USER_STATUSES.find(st => window.location.pathname.includes(st));
        }

        if (window.location.pathname.includes('registration')) {
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
    
    setTimeout(() => {
        checkForRegistrationSuccess();
        determineAndShowInitialBlock();
    }, 100);

    sendInitialStatus();
    sendCartStatus();
    document.addEventListener("cart-updated", sendCartStatus);

    const loginForm = document.querySelector('.authorization form');
    
    window.addEventListener('load', () => {
        checkForRegistrationSuccess();
        determineAndShowInitialBlock();
        showBlock(authorizationBlock, 'authorization');
    });
    
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
        
            const formData = new FormData(loginForm);
        
            try {
                const response = await fetch("/authorization", {
                    method: "POST",
                    body: formData
                });
            
                const result = await response.text();
            
                if (result.trim() === "success") {
                    notifyCloseUser();       
                    window.location.reload();
                } else {
                    console.log("Ошибка авторизации");
                }
            
            } catch (error) {
                console.error("Ошибка запроса:", error);
            }
        });
    }
    
    const registrationForm = document.querySelector('.registration form');
    if (registrationForm) {
        console.log('Registration form found');
        registrationForm.addEventListener('submit', (e) => {
            console.log('Registration form submitted');
        });
    }
}

function initParentLogic() {
    const modalCart = document.getElementById("cart-modal");
    const frameCart = document.getElementById("cart-frame");
    const modalUser = document.getElementById("user-modal");
    const frameUser = document.getElementById("user-frame");
    const backgroundModal = document.querySelector('.background-modal');

    const openCartBtn = document.getElementById("open-cart");
    const closeCartBtn = document.getElementById("close-cart");
    const openUserBtns = document.querySelectorAll("#open-user");
    const continueBtn = document.querySelector(".continue_shopping");

    console.log('[ModalWindow_user] initParentLogic - DOM elements found:', {
        modalCart: !!modalCart,
        frameCart: !!frameCart,
        modalUser: !!modalUser,
        frameUser: !!frameUser,
        backgroundModal: !!backgroundModal,
        openCartBtn: !!openCartBtn,
        openUserBtns: openUserBtns.length
    });
    
    function setUserModalStatus(status) {
        if (!modalUser) return;
        USER_STATUSES.forEach(st => modalUser.classList.remove(st));

        if (status) {
            modalUser.classList.add(status);
            adjustIframeHeight(status);
        }
    }

    function adjustIframeHeight(status) {
        const iframe = modalUser?.querySelector('iframe');
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
            if (backgroundModal) {
                backgroundModal.style.display = 'none';
            }
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
                if (frameUser) frameUser.src = "/authorization";
                modalUser?.classList.add("active");
                if (backgroundModal) {
                    backgroundModal.style.display = 'block';
                }
            }
        });
    });

    document.addEventListener("click", (e) => {
        if (window.self === window.top) {
            const registrationLink = e.target.closest('a[href="/registration"], a[href*="registration"]');
            if (registrationLink) {
                e.preventDefault();
                if (modalUser?.classList.contains("active")) {
                    closeUser();
                } else {
                    closeCart();
                    if (frameUser) frameUser.src = "/registration";
                    modalUser?.classList.add("active");
                    if (backgroundModal) backgroundModal.style.display = 'block';
                }
            }

            const authorizationLink = e.target.closest('a[href="/authorization"], a[href*="authorization"]');
            if (authorizationLink) {
                e.preventDefault();
                if (modalUser?.classList.contains("active")) {
                    closeUser();
                } else {
                    closeCart();
                    if (frameUser) frameUser.src = "/authorization";
                    modalUser?.classList.add("active");
                    if (backgroundModal) backgroundModal.style.display = 'block';
                }
            }

            const forgotPasswordLink = e.target.closest('a[href="/forgot-password"], a[href*="forgot-password"]');
            if (forgotPasswordLink) {
                e.preventDefault();
                if (modalUser?.classList.contains("active")) {
                    closeUser();
                } else {
                    closeCart();
                    if (frameUser) frameUser.src = "/forgot-password";
                    modalUser?.classList.add("active");
                    if (backgroundModal) backgroundModal.style.display = 'block';
                }
            }
        }
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
            case "authorization-success":
                window.location.reload();
                break;

            case "close-cart":
                closeCart();
                break;

            case "user-status":
                setUserModalStatus(data.status);
                break;

            case "load-registration":
                if (frameUser) {
                    setTimeout(() => {
                        frameUser.src = "/registration";
                    }, 50);
                }
                setUserModalStatus('registration');
                break;

            case "load-authorization":
                if (frameUser) {
                    setTimeout(() => {
                        frameUser.src = "/authorization";
                    }, 50);
                }
                setUserModalStatus('authorization');
                break;

            case "load-forgot-password":
                if (frameUser) {
                    setTimeout(() => {
                        frameUser.src = "/forgot-password";
                    }, 50);
                }
                setUserModalStatus('forgot-password');
                break;

            case "cart-status":
                if (modalCart) {
                    modalCart.classList.toggle("empty", data.empty);
                    modalCart.classList.toggle("filled", !data.empty);
                }
                break;
        }
    });
    
    if (backgroundModal) {
        backgroundModal.addEventListener('click', (e) => {
            closeUser();
            closeCart();
        });
    }
    
    function initInitialState() {
        const urlParams = new URLSearchParams(window.location.search);
    
        if (urlParams.get('action') === 'agreement-reset-password') {
            if (modalUser && frameUser) {
                modalUser.classList.add("active");
                
                if (backgroundModal) {
                    backgroundModal.style.display = 'block';
                }
                setUserModalStatus('new-password'); 
                
                const token = urlParams.get('token');
                let url = "/forgot-password?action=agreement-reset-password";
                if (token) {
                    url += `&token=${encodeURIComponent(token)}`;
                }
                frameUser.src = url;
                
                frameUser.onload = () => {
                    setTimeout(() => {
                        console.log('[ModalWindow_user] iframe loaded, ensuring new-password status');
                        setUserModalStatus('new-password');
                    }, 100);
                };
                window.history.replaceState({}, document.title, window.location.pathname);
            }
        }
    }
    initInitialState();
}


