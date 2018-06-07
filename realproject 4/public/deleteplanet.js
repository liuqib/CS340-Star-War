function deletePlanet(id){
    $.ajax({
        url: '/planet/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};
