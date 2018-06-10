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
        context.jsscripts = ["deleteperson.js"];
        var mysql = req.app.get('mysql');
        // console.log(mysql);
        getPeople(res, mysql, context, complete);
        getPlanets(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('filter', context);
            }

        }
    });

    router.post('/', function(req, res){
        // console.log(req.body.planet_id)
        // console.log(req.body)
        var mysql = req.app.get('mysql');
        // var sql = "INSERT INTO db_character (fname, lname, side, homeworld, race) VALUES ([fnameInput], [lnameInput], [sideInput], [homeworld_id_from_dropdown_Input], [raceInput])";
        var sql = "SELECT fname, lname FROM db_character WHERE side = ?";
        var inserts = [req.body.Choose_Side];
        console.log(req.body.Choose_Side);
        // console.log("dont call me");
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/character');
            }
        });
    });


    return router;
}();
