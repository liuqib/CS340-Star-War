module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getWeapons(res, mysql, context, complete){
        mysql.pool.query("SELECT db_weapon.weapon_id, name, side, color FROM db_weapon", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.weapons  = results;
            // console.log(context.planets);
            complete();
        });
    }

    /*Display all planet. Requires web based javascript to delete users with AJAX*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteweapon.js"];
        var mysql = req.app.get('mysql');
        // console.log(mysql);
        // getPeople(res, mysql, context, complete);
        getWeapons(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('weapon', context);
            }

        }
    });

    /* Adds a person, redirects to the planet page after adding */

    router.post('/', function(req, res){
        // console.log(req.body.homeworld)
        // console.log(req.body)
        var mysql = req.app.get('mysql');
        // var sql = "INSERT INTO db_weapon (fname, lname, side, homeworld, race) VALUES ([fnameInput], [lnameInput], [sideInput], [homeworld_id_from_dropdown_Input], [raceInput])";
        var sql = "INSERT INTO db_weapon (name, side, color) VALUES (?,?,?)";
        var inserts = [req.body.name, req.body.Side, req.body.color];
        // console.log(req.body.homeworld)
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/weapon');
            }
        });
    });


    /* Route to delete a person, simply returns a 202 upon success. Ajax will handle this. */

    router.delete('/:id', function(req, res){
      // console.log("imhere");
        var mysql = req.app.get('mysql');
        // var sql = "DELETE FROM planet WHERE id = [planet_ID_selected_from_browse_planet_page]";
        var sql = "DELETE FROM db_weapon WHERE weapon_id = ?";
        var inserts = [req.params.id];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }else{
                res.status(202).end();
            }
        })
      })

      return router;
}();
