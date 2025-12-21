import {countProduct} from "./countProduct.js"

const arrayButtonsPlus = document.querySelectorAll('.plus') 

for (let button of arrayButtonsPlus){
    button.addEventListener(
        'click',
        (event) => {
            let listIdProduct = document.cookie.split('=')[1]
            document.cookie = `list_products = ${listIdProduct}|${button.id}|; path = /`
            countProduct(button.id)
        }
    )
}