document.addEventListener("DOMContentLoaded", () => {
    const openBtn = document.getElementById("open-cart");
    const modal = document.getElementById("cart-modal");
    const frame = document.getElementById("cart-frame");
    const overlay = document.getElementById("overlay");

    openBtn.addEventListener("click", () => {
        if (modal.classList.contains("active")) {
            modal.classList.remove("active");
            overlay.classList.remove("show");
            frame.src = "";
            return;
        }

        frame.src = "/cart";
        modal.classList.add("active");
        overlay.classList.add("show");
    });

    overlay.addEventListener("click", () => {
        modal.classList.remove("active");
        overlay.classList.remove("show");
        frame.src = "";
    });
});
