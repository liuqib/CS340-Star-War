function updateCharacter_planet(id){
    $.ajax({
        url: '/one2m/' + id,
        type: 'PUT',
        data: $('#updateone2m').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};

function De_associate(id){
    $.ajax({
        url: '/one2m/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};
