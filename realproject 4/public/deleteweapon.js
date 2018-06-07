function deleteWeapon(id){
  // console.log(id);
    $.ajax({
        url: '/weapon/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};
