document.addEventListener("DOMContentLoaded", () => {
    const openBtn = document.getElementById("open-cart");
    const closeBtn = document.getElementById("close-cart");
    const modal = document.getElementById("cart-modal");
    const frame = document.getElementById("cart-frame");
    if (!openBtn || !modal || !frame) return;

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
});