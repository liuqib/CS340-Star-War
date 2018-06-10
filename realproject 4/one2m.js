module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getPlanets(res, mysql, context, complete){
        mysql.pool.query("SELECT db_planet.planet_id, name FROM db_planet", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.planets  = results;
            // console.log(context.planets);
            complete();
        });
    }

    function getPeople(res, mysql, context, complete){
        mysql.pool.query("SELECT db_character.character_id, fname, lname, db_character.side, db_planet.name AS homeworld, race FROM db_character INNER JOIN db_planet ON homeworld = db_planet.planet_id", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.character = results;
            // console.log(context.character);
            complete();
        });
    }

    function getPerson(res, mysql, context, id, complete){
        var sql = "SELECT character_id, fname, lname, side, homeworld, race FROM db_character WHERE character_id = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.person = results[0];
            // console.log(context.person);
            complete();
        });
    }

    /*Display all character. Requires web based javascript to delete users with AJAX*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["updateone2m.js"];
        var mysql = req.app.get('mysql');
        // console.log(mysql);
        getPeople(res, mysql, context, complete);
        getPlanets(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('one2m', context);
            }

        }
    });

    /* Display one person for the specific purpose of updating character */

    router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["selectedplanet.js", "updateone2m.js"];
        var mysql = req.app.get('mysql');
        getPerson(res, mysql, context, req.params.id, complete);
        getPlanets(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
              // console.log(context);
                res.render('updateone2m', context);
            }
        }
    });

    /* Adds a person, redirects to the character page after adding */

    // router.post('/', function(req, res){
    //     // console.log(req.body.planet_id)
    //     // console.log(req.body)
    //     var mysql = req.app.get('mysql');
    //     // var sql = "INSERT INTO db_character (fname, lname, side, homeworld, race) VALUES ([fnameInput], [lnameInput], [sideInput], [homeworld_id_from_dropdown_Input], [raceInput])";
    //     var sql = "INSERT INTO db_character (fname, lname, side, homeworld, race) VALUES (?,?,?,?,?)";
    //     var inserts = [req.body.fname, req.body.lname, req.body.Side, req.body.planet_id, req.body.race];
    //     console.log("dont call me");
    //     sql = mysql.pool.query(sql,inserts,function(error, results, fields){
    //         if(error){
    //             console.log(JSON.stringify(error))
    //             res.write(JSON.stringify(error));
    //             res.end();
    //         }else{
    //             res.redirect('/character');
    //         }
    //     });
    // });

    /* The URI that update data is sent to in order to update a person */

    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "UPDATE db_character SET homeworld=? WHERE character_id=?";
        var inserts = [req.body.planet_id, req.params.id];
        // console.log(req.body.fname);
        // console.log(req.params.id);
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
              // console.log("shouldnt be me");
              // console.log(error);
                res.write(JSON.stringify(error));
                res.end();
            }else{
              // console.log("should be me");
                res.status(200);
                res.end();
            }
        });
    });

    /* Route to delete a person, simply returns a 202 upon success. Ajax will handle this. */

    router.delete('/:id', function(req, res){
      // console.log("imhere");
        var mysql = req.app.get('mysql');
        // var sql = "DELETE FROM character WHERE id = [character_ID_selected_from_browse_character_page]";
        var sql = "UPDATE db_character SET homeworld=15 WHERE character_id=?";
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
