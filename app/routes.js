

// grab the nerd model we just created
var BuildingPos = require('./models/BuildingsPos');
var BuildingMonthly = require('./models/BuildingsMonthly');
var BuildingNames = require('./models/BuildingsNames');
var BuildingParams = require('./models/BuildingsParams');
var BuildingParamsBis = require('./models/BuildingsParamsBis');
var BuildingFloors = require('./models/BuildingsFloors');
var Zones = require('./models/Zones');

var Datastore = require('nedb'); 
fs = require('fs');

var buildingparamsDB = new Datastore({ filename: './data/buildingparamsDB.db', autoload: true });


/*buildingparamsDB.insert(JSON.parse(fs.readFileSync('./public/jsons/infoBldg.json', 'utf8')),function(err, newDoc){
    
});*/

/*var Datastore = require('nedb'), 
path = require('path'),
db = new Datastore({
  filename:path.join(require('nw.gui').App.dataPath, 'todo.db'),
  autoload: true
}); */

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

        app.get('/api/buildingsmonthly/:id', function(req, res) { 
            // use mongoose to get all nerds in the database
            var idnum = Number(req.params.id);
            BuildingMonthly.find({id:idnum},function(err, doc) {

                // if there is an error retrieving, send the error. 
                                // nothing after res.send(err) will execute
                if (err)
                    res.send(err);

                res.json(doc); // return all nerds in JSON format
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

/*        app.get('/api/buildingsparams', function(req, res) {
            // use mongoose to get all nerds in the database
           BuildingParams.find(function(err, buildingsparams) { 
          
                // if there is an error retrieving, send the error. 
                                // nothing after res.send(err) will execute
                if (err)
                    res.send(err);

                res.json(buildingsparams); // return all nerds in JSON format
            });
        }); */

        app.get('/api/buildingsparams', function(req, res) {
            
           buildingparamsDB.find({},function(err, buildingsparams) { console.log(buildingsparams);
                if (err)
                    res.send(err);
                res.json(buildingsparams); 
            });
        });



       app.get('/api/buildingsparamsbis', function(req, res) {
            // use mongoose to get all nerds in the database
           BuildingParamsBis.find(function(err, buildingsparamsbis) {

                // if there is an error retrieving, send the error. 
                                // nothing after res.send(err) will execute
                if (err)
                    res.send(err);

                res.json(buildingsparamsbis); // return all nerds in JSON format
            });
        });

        app.get('/api/buildingsfloors', function(req, res) {
            // use mongoose to get all nerds in the database
           BuildingFloors.find(function(err, buildingsfloors) {

                // if there is an error retrieving, send the error. 
                                // nothing after res.send(err) will execute
                if (err)
                    res.send(err);

                res.json(buildingsfloors); // return all nerds in JSON format
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