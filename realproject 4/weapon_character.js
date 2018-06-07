module.exports = function(){
    var express = require('express');
    var router = express.Router();

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
        sql = "SELECT cid, wid FROM weapon_character"//, CONCAT(fname,' ',lname) AS name, name  FROM db_character INNER JOIN db_weapon_character ON db_character.character_id = db_weapon_character.cid INNER JOIN db_weapon_character on db_weapon.weapon_id = db_weapon_character.wid ORDER BY name, name"
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
        console.log("looool");
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('weapon_character', context);
            }
        }
    });

    router.post('/', function(req, res){
        console.log("We get the multi-select certificate dropdown as ", req.body.name)
        var mysql = req.app.get('mysql');
        // let's get out the certificates from the array that was submitted by the form
        var weapon = req.body.wid;
        var characters = req.body.cid;
        for (let name of weapon) {

          var sql = "INSERT INTO db_weapon_charactor (wid, cid) VALUES (?, ?)";
          var inserts = [characters, weapon];
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
        } //for loop ends here
        res.redirect('/weapon_character');
    });

    router.put('/cid/:cid/wid/:wid',function(req,res){
      var mysql = req.app.get('mysql');
      var sql = "UPDATE de_weapon_character SET cid = ? , wid = ?";
      var insert = [req.body.cid, req.body.wid];
      sql = mysql.pool.query(sql, insert, function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.end();
        }else{
            res.status(200);
            res.end();
        }
      });
    });

    router.delete('/cid/:cid/wid/:wid', function(req, res){
        //console.log(req) //I used this to figure out where did pid and cid go in the request
        console.log(req.params.cid)
        console.log(req.params.wid)
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM db_weapon_charactor WHERE wid = ? AND cid = ?";
        var inserts = [req.params.cid, req.params.wid];
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
