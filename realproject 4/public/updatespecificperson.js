function updatespecificpersonPerson(id){
    $.ajax({
        url: '/updatespecificperson/' + id,
        type: 'PUT',
        data: $('#update-character').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};
