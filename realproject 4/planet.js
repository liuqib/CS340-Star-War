module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getPlanets(res, mysql, context, complete){
        mysql.pool.query("SELECT db_planet.planet_id, name, side, p_condition FROM db_planet", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.planets  = results;
            // console.log(context.planets);
            complete();
        });
    }

    /*Display all planet. Requires web based javascript to delete users with AJAX*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteplanet.js"];
        var mysql = req.app.get('mysql');
        // console.log(mysql);
        // getPeople(res, mysql, context, complete);
        getPlanets(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('planet', context);
            }

        }
    });

    /* Display one person for the specific purpose of updating planet */

    // router.get('/:id', function(req, res){
    //     callbackCount = 0;
    //     var context = {};
    //     context.jsscripts = ["selectedplanet.js", "updateplanet.js"];
    //     var mysql = req.app.get('mysql');
    //     // getPerson(res, mysql, context, req.params.id, complete);
    //     getPlanets(res, mysql, context, complete);
    //     function complete(){
    //         callbackCount++;
    //         if(callbackCount >= 1){
    //             res.render('update-planet', context);   //doesn't have update-planet
    //         }
    //     }
    // });

    /* Adds a person, redirects to the planet page after adding */

    router.post('/', function(req, res){
        // console.log(req.body.homeworld)
        // console.log(req.body)
        var mysql = req.app.get('mysql');
        // var sql = "INSERT INTO db_planet (fname, lname, side, homeworld, race) VALUES ([fnameInput], [lnameInput], [sideInput], [homeworld_id_from_dropdown_Input], [raceInput])";
        var sql = "INSERT INTO db_planet (name, side, p_condition) VALUES (?,?,?)";
        var inserts = [req.body.name, req.body.Side, req.body.condition];
        // console.log(req.body.homeworld)
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/planet');
            }
        });
    });

    /* The URI that update data is sent to in order to update a person */

    // router.put('/:id', function(req, res){
    //     var mysql = req.app.get('mysql');
    //     // var sql = "UPDATE db_planet SET fname=[fnameInput], lname=[lnameInput], side=[sideInput], homeworld=[homeworld_id_from_dropdown_Input], race=[raceInput] WHERE id=[planet_ID_from_the_update_form]";
    //     var sql = "UPDATE db_planet SET name=?,  side=?, p_condition=? WHERE id=?";
    //     var inserts = [req.body.name, req.body.Side, req.body.condition, req.params.id];
    //     sql = mysql.pool.query(sql,inserts,function(error, results, fields){
    //         if(error){
    //             res.write(JSON.stringify(error));
    //             res.end();
    //         }else{
    //             res.status(200);
    //             res.end();
    //         }
    //     });
    // });

    /* Route to delete a person, simply returns a 202 upon success. Ajax will handle this. */

    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        // var sql = "DELETE FROM planet WHERE id = [planet_ID_selected_from_browse_planet_page]";
        var sql = "DELETE FROM db_planet WHERE planet_id = ?";
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
