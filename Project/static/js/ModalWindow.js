document.addEventListener("DOMContentLoaded", () => {
    const openBtn = document.getElementById("open-cart");
    const modal = document.getElementById("cart-modal");
    const frame = document.getElementById("cart-frame");

    openBtn.addEventListener("click", () => {
        if (modal.classList.contains("active")) {
            modal.classList.remove("active");
            frame.src = "";
        } else {
            frame.src = "/cart";
            modal.classList.add("active");
        }
    });
});