function deleteSpaceship(id){
  // console.log(id);
    $.ajax({
        url: '/Spaceship/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};
