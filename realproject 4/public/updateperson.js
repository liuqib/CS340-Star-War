function updatePerson(id){
    $.ajax({
        // console.log('id');
        url: '/character/' + id,
        type: 'PUT',
        data: $('#updatespecificperson').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};
