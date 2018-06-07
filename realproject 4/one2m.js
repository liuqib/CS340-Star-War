module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getPlanets(res, mysql, context, complete){
        mysql.pool.query("SELECT planet_id, name FROM db_planet", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.planet  = results;
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
        var sql = "SELECT character_id, fname, lname, side, homeworld, race FROM db_character WHERE character_id = [character_ID_selected_from_browse_character_page]";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.person = results[0];
            complete();
        });
    }

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
                res.render('one2m', context);
            }

        }
    });

    router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["selectedplanet.js", "updateperson.js"];
        var mysql = req.app.get('mysql');
        getPerson(res, mysql, context, req.params.id, complete);
        getPlanets(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('one2m', context);
            }

        }
    });

    router.post('/', function(req, res){
        // console.log(req.body.homeworld)
        // console.log(req.body)
        var mysql = req.app.get('mysql');
        // var sql = "INSERT INTO db_character (fname, lname, side, homeworld, race) VALUES ([fnameInput], [lnameInput], [sideInput], [homeworld_id_from_dropdown_Input], [raceInput])";
        var sql = "INSERT INTO db_character (fname, lname, side, homeworld, race) VALUES (?,?,?,?,?)";
        var inserts = [req.body.fname, req.body.lname, req.body.Side, req.body.planet, req.body.race];
        // console.log(req.body.homeworld)
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/one2m');
            }
        });
    });

    return router;
    }();
