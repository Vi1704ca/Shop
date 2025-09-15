export function countProduct(id){
    let count = 0
    let arrayId = document.cookie.split('=')[1].split('|')
    let text = document.querySelector(`.count-${id}`)
    for (let productId of arrayId){
        if (productId === id){
            count += 1 
        }
    }
    text.textContent = count
    return count
}