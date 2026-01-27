document.addEventListener("DOMContentLoaded", function () {
    const isIframe = window.self !== window.top;
    const USER_STATUSES = [
        "authorization",
        "registration",
        "registration-success",
        "forgot-password",
        "new-password",
        "password-reset-success"
    ];

    if (isIframe) {
        const sendEmailBtn = document.querySelector('.send_an_email');
        const savePasswordBtn = document.querySelector('.save_password');
        const loginFinalBtn = document.querySelector('.save_password_final');
        const cancelBtns = document.querySelectorAll('.cancel');
        
        const closeBtns = document.querySelectorAll('.close-password-reset, .close-password-reset-final, [class*="close_"], [class*="close-"]');
        
        const passwordResetBlock = document.querySelector('.password_reset');
        const newPasswordBlock = document.querySelector('.new-password');
        const passwordResetFinalBlock = document.querySelector('.password_reset_final');

        function notifyParentStatus(status) {
            try {
                window.parent.postMessage({ type: "user-status", status: status }, "*");
            } catch (e) {}
        }

        function notifyCloseUser() {
            try {
                window.parent.postMessage({ type: "close-user" }, "*");
            } catch (e) {}
        }

        const url = window.location.pathname;
        let currentStatus = "";
        USER_STATUSES.forEach(st => {
            if (url.includes(st)) currentStatus = st;
        });
        if (currentStatus) notifyParentStatus(currentStatus);

        if (sendEmailBtn) {
            sendEmailBtn.addEventListener('click', function (e) {
                if (newPasswordBlock) {
                    hideAllBlocks();
                    newPasswordBlock.style.display = 'block';
                }
                notifyParentStatus('new-password');
            });
        }

        if (savePasswordBtn) {
            savePasswordBtn.addEventListener('click', function (e) {
                if (passwordResetFinalBlock) {
                    hideAllBlocks();
                    passwordResetFinalBlock.style.display = 'block';
                }
                notifyParentStatus('password-reset-success');
            });
        }

        cancelBtns.forEach(btn => {
            btn.addEventListener('click', function (e) {
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
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                notifyCloseUser();
            });
        });

        if (loginFinalBtn) loginFinalBtn.addEventListener('click', notifyCloseUser);

        function hideAllBlocks() {
            if (passwordResetBlock) passwordResetBlock.style.display = 'none';
            if (newPasswordBlock) newPasswordBlock.style.display = 'none';
            if (passwordResetFinalBlock) passwordResetFinalBlock.style.display = 'none';
        }

        function sendCartStatus() {
            const items = document.querySelectorAll(".cart-item").length;
            try {
                window.parent.postMessage({ type: "cart-status", empty: items === 0 }, "*");
            } catch (e) {}
        }
        sendCartStatus();
        document.addEventListener("cart-updated", sendCartStatus);
    }

    else {
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
            }
        }

        function closeCart() {
            if (modalCart) {
                modalCart.classList.remove("active");
                frameCart.src = "";
            }
        }

        function closeUser() {
            if (modalUser) {
                modalUser.classList.remove("active");
                frameUser.src = "";
                setUserModalStatus(null); 
            }
        }

        if (openCartBtn) {
            openCartBtn.addEventListener("click", () => {
                closeUser(); 
                frameCart.src = "/cart";
                modalCart.classList.add("active");
            });
        }

        if (openUserBtns) {
            openUserBtns.forEach(btn => {
                btn.addEventListener("click", () => {
                    closeCart(); 
                    frameUser.src = "/authorization"; 
                    modalUser.classList.add("active");
                });
            });
        }

        if (closeCartBtn) closeCartBtn.addEventListener("click", closeCart);
        if (continueBtn) continueBtn.addEventListener("click", closeCart);

        window.addEventListener("message", (event) => {
            const data = event.data;
            if (!data) return;

            switch (data.type) {
                case "close-user":
                    closeUser();
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
    }
});