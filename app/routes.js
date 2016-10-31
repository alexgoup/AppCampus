

// grab the nerd model we just created
var BuildingPos = require('./models/BuildingsPos');
var BuildingNames = require('./models/BuildingsNames');
var Zones = require('./models/Zones');

    module.exports = function(app) {

        // server routes ===========================================================
        // handle things like api calls
        // authentication routes

        // sample api route
        app.get('/api/buildingspos', function(req, res) {
            // use mongoose to get all nerds in the database
            BuildingPos.find(function(err, buildingspos) {

                // if there is an error retrieving, send the error. 
                                // nothing after res.send(err) will execute
                if (err)
                    res.send(err);

                res.json(buildingspos); // return all nerds in JSON format
            });
        });

        app.get('/api/buildingsnames', function(req, res) {
            // use mongoose to get all nerds in the database
            BuildingNames.find(function(err, buildingsnames) {

                // if there is an error retrieving, send the error. 
                                // nothing after res.send(err) will execute
                if (err)
                    res.send(err);

                res.json(buildingsnames); // return all nerds in JSON format
            });
        });

        app.get('/api/zones', function(req, res) {
            // use mongoose to get all nerds in the database
           Zones.find(function(err, zones) {

                // if there is an error retrieving, send the error. 
                                // nothing after res.send(err) will execute
                if (err)
                    res.send(err);

                res.json(zones); // return all nerds in JSON format
            });
        });

        // route to handle creating goes here (app.post)
        // route to handle delete goes here (app.delete)

        // frontend routes =========================================================
        // route to handle all angular requests
        /*app.get('*', function(req, res) {
            res.sendfile('./public/views/index.html'); // load our public/index.html file
        });*/
        var path = require('path');
        app.get('*', function(req, res) {
          res.sendFile(path.join(__dirname, '../public/views/index.html')); 
        });

    };