//let pass = document.getElementById("pass")
//let eye = document.getElementById("eye")

//eye.addEventListener("click", () => {
    //if (pass.type === "text") {
        //pass.type = "password"
    //}
    //else{
        //pass.type = "text"
    //}
//})

let eyes = document.querySelectorAll("#eye");

eyes.forEach(eye => {
    eye.addEventListener("click", () => {
        let pass = eye.nextElementSibling;
        if (pass.type === "text") {
            pass.type = "password"
        }
        else{
            pass.type = "text"
        }
    });
});