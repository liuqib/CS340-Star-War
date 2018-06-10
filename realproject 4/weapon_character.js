module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getPeople(res, mysql, context, complete){
        mysql.pool.query("SELECT db_character.character_id AS cid, fname, lname, db_character.side, db_planet.name AS homeworld, race FROM db_character INNER JOIN db_planet ON homeworld = db_planet.planet_id", function(error, results, fields){
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
        var sql = "SELECT character_id, fname, lname, side, homeworld, race FROM db_character WHERE character_id = ？";
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

    function getWeapons(res, mysql, context, complete){
        sql = "SELECT weapon_id AS wid, name FROM db_weapon";
        mysql.pool.query(sql, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end()
            }
            context.weapon = results;
            complete();
        });
    }

    function getPeopleWithWeapons(res, mysql, context, complete){
        sql = "SELECT wid, cid, CONCAT(fname,' ',lname) AS c_name, name FROM db_character INNER JOIN weapon_character ON db_character.character_id = weapon_character.cid INNER JOIN db_weapon ON db_weapon.weapon_id = weapon_character.wid ORDER BY cid";
         mysql.pool.query(sql, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end()
            }
            context.weapon_character = results;
            complete();
        });
    }

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteperson.js"];
        var mysql = req.app.get('mysql');
        getPeople(res, mysql, context, complete);
        getWeapons(res, mysql, context, complete);
        getPeopleWithWeapons(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('weapon_character', context);
            }
        }
    });

    router.post('/', function(req, res){
        // console.log("We get the multi-select certificate dropdown as ", req.body.name)
        var mysql = req.app.get('mysql');
        // let's get out the certificates from the array that was submitted by the form
        // for (let name of weapon) {

          var sql = "INSERT INTO weapon_character (wid, cid) VALUES (?, ?)";
          var inserts = [req.body.wid, req.body.cid];
          sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                //TODO: send error messages to frontend as the following doesn't work
                /*
                res.write(JSON.stringify(error));
                res.end();
                */
                console.log(error)
            }
          });
        // } //for loop ends here
        res.redirect('/weapon_character');
    });

    // router.put('/cid/:cid/wid/:wid',function(req,res){
    //   var mysql = req.app.get('mysql');
    //   var sql = "UPDATE de_weapon_character SET cid = ? , wid = ?";
    //   var insert = [req.body.cid, req.body.wid];
    //   sql = mysql.pool.query(sql, insert, function(error, results, fields){
    //     if(error){
    //         res.write(JSON.stringify(error));
    //         res.end();
    //     }else{
    //         res.status(200);
    //         res.end();
    //     }
    //   });
    // });

    router.delete('/wid/:wid/cid/:cid', function(req, res){
        //console.log(req) //I used this to figure out where did pid and cid go in the request
        // console.log(req.params.cid)
        // console.log(req.params.wid)
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM weapon_character WHERE wid = ? AND cid = ?";
        var inserts = [req.params.wid, req.params.cid];
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
