// 
alert
$(document).ready(function (){
    let arrayButtonDelete = document.querySelectorAll('#delete')
    $(arrayButtonDelete).each(function(index){
        $(this).on('click', function (){
            $.ajax({
                contentType: 'application/json',
                url: '/shop/delete',
                type: 'post',
                data: $(this).val(),
                success: function (response){
                    console.log(response)
                }
            })
        })
    })
})
