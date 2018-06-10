function updatePerson(id){
    $.ajax({
        url: '/character/' + id,
        type: 'PUT',
        data: $('#updatespecificperson').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};
