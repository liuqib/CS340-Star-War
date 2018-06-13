module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getSpaceships(res, mysql, context, complete){
        mysql.pool.query("SELECT db_spaceship.spaceship_id, name, side, type FROM db_spaceship", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.ships  = results;
            // console.log(context.ships);
            complete();
        });
    }

    /*Display all planet. Requires web based javascript to delete users with AJAX*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteship.js"];
        var mysql = req.app.get('mysql');
        // console.log(mysql);
        // getPeople(res, mysql, context, complete);
        getSpaceships(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('Spaceship', context);
            }

        }
    });

    /* Adds a person, redirects to the planet page after adding */

    router.post('/', function(req, res){
        // console.log(req.body.homeworld)
        // console.log(req.body)
        var mysql = req.app.get('mysql');
        // var sql = "INSERT INTO db_spaceship (fname, lname, side, homeworld, race) VALUES ([fnameInput], [lnameInput], [sideInput], [homeworld_id_from_dropdown_Input], [raceInput])";
        var sql = "INSERT INTO db_spaceship (name, side, type) VALUES (?,?,?)";
        var inserts = [req.body.name, req.body.Side, req.body.type];
        // console.log(req.body.homeworld)
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/Spaceship');
            }
        });
    });

    /* Route to delete a person, simply returns a 202 upon success. Ajax will handle this. */

    router.delete('/:id', function(req, res){
      // console.log("imhere");
        var mysql = req.app.get('mysql');
        // var sql = "DELETE FROM planet WHERE id = [planet_ID_selected_from_browse_planet_page]";
        var sql = "DELETE FROM db_spaceship WHERE spaceship_id = ?";
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
