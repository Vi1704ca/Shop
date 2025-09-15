import { countProduct } from "./countProduct.js"
const listButtonMinus = document.querySelectorAll('.minus')

for (let button of listButtonMinus){
    button.addEventListener(
        'click',
        (event) => {
            // document.cookie -> "list_products = |3||3||3||3||3||3|".split('=') ->
            // -> ["list_products", "|3||3||3||3||3||3|"][1] -> "|3||3||3||3||3||3|"
            let cookies = document.cookie.split('=')[1]
            if (countProduct(button.id) > 1){
                cookies = cookies.replace(`|${button.id}|`, '')
                document.cookie = `list_products = ${cookies}; path = /`
            }
            countProduct(button.id)
        }
    )
}