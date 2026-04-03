function closeCart() {
    try {
        window.parent.postMessage({ type: "close-cart" }, "*");
    } catch (e) {
        try {
            window.top.postMessage({ type: "close-cart" }, "*" );
        } catch (error) {}
    }
}

function initCartModal() {
    const openBtn = document.getElementById("open-cart");
    const modal = document.getElementById("cart-modal");
    const frame = document.getElementById("cart-frame");
    const closeBtn = document.getElementById("close-cart");
    const continueBtn = document.querySelector(".continue_shopping");
    const isIframe = window.self !== window.top;

    console.debug("[ModalWindow_cart] init", {
        openBtn: !!openBtn,
        modal: !!modal,
        frame: !!frame,
        isIframe,
    });

    function tryCloseCart() {
        if (modal) {
            modal.classList.remove("active");
        }
        if (frame) {
            frame.src = "";
        }
    }

    if (closeBtn) {
        closeBtn.addEventListener("click", (e) => {
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

    if (isIframe) {
        function sendCartStatus() {
            const items = document.querySelectorAll(".cart-item").length;
            const isEmpty = items === 0;

            try {
                window.parent.postMessage({
                    type: "cart-status",
                    empty: isEmpty,
                }, "*");
            } catch (e) {}
        }

        sendCartStatus();
        document.addEventListener("cart-updated", sendCartStatus);
    } else {
        document.addEventListener("click", (e) => {
            const openBtnClicked = e.target.closest("#open-cart");
            if (!openBtnClicked) return;

            e.preventDefault();
            if (!modal || !frame) return;

            frame.src = "/cart";
            modal.classList.add("active");
        });

        window.addEventListener("message", (event) => {
            const data = event && event.data;
            if (!data) return;

            if (data.type === "close-cart") {
                tryCloseCart();
            }

            if (data.type === "cart-status" && modal) {
                modal.classList.toggle("empty", data.empty);
                modal.classList.toggle("filled", !data.empty);
            }
        });
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCartModal);
} else {
    initCartModal();
}

window.addEventListener("message", (event) => {
    const data = event && event.data;
    if (!data || data.type !== "close-cart") return;

    const modal = document.getElementById("cart-modal");
    const frame = document.getElementById("cart-frame");

    if (modal) modal.classList.remove("active");
    if (frame) frame.src = "";
});

document.querySelector(".make-an-order").addEventListener("click", (e) => {
    e.preventDefault();
    try {
        window.parent.postMessage({ type: "navigate", url: "/orders" }, "*");
    } catch (err) {
        try {
            window.top.postMessage({ type: "navigate", url: "/orders" }, "*");
        } catch (error) {}
    }
});