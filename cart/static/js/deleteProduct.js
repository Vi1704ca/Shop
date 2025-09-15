const listButtonDelete = document.querySelectorAll('.delete')

for (let button of listButtonDelete){
    button.addEventListener(
        "click",
        (event) => {
            let cookies = document.cookie.split('=')[1]
            document.cookie = `list_products = ${cookies.replaceAll(`|${button.id}|`, '')}; path = /`
            // let product = document.querySelector(`product-${button.id}`)
            // product.remove()
            document.querySelector(`.product-${button.id}`).remove()
        }
    )
}
