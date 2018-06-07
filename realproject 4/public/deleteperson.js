function deleteCharacter(id){
  // console.log(id);
    $.ajax({
        url: '/character/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};

function deleteCharacter_weapon(wid, cid){
  $.ajax({
      url: '/m2m/cid/' + cid + '/weapon/' + wid,
      type: 'DELETE',
      success: function(result){
          if(result.responseText != undefined){
            alert(result.responseText)
          }
          else {
            window.location.reload(true)
          }
      }
  })
};
