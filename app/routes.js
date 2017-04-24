

// using mongodb .. 
/*var BuildingPos = require('./models/BuildingsPos');
var BuildingMonthly = require('./models/BuildingsMonthly');
var BuildingNames = require('./models/BuildingsNames');
var BuildingParams = require('./models/BuildingsParams');
var BuildingParamsBis = require('./models/BuildingsParamsBis');
var BuildingFloors = require('./models/BuildingsFloors');
var Zones = require('./models/Zones');*/

var Datastore = require('nedb'); 
fs = require('fs');

var buildingparamsDB = new Datastore({ filename: './data/buildingparamsDB.db', autoload: true });
var buildingposDB = new Datastore({ filename: './data/buildingposDB.db', autoload: true });
var buildingnamesDB = new Datastore({ filename: './data/buildingnamesDB.db', autoload: true });
var buildingparamsbisDB = new Datastore({ filename: './data/buildingparamsbisDB.db', autoload: true });
var buildingfloorsDB = new Datastore({ filename: './data/buildingfloorsDB.db', autoload: true });
var buildingmonthlyDB = new Datastore({ filename: './data/buildingmonthlyDB.db', autoload: true });
var zonesDB = new Datastore({ filename: './data/zonesDB.db', autoload: true });
var scenariosDB = new Datastore({ filename: './data/scenariosDB.db', autoload: true });

//EX to insert into NEDB database (permanent, writes into files)
/*buildingparamsbisDB.insert(JSON.parse(fs.readFileSync('./public/jsons/buildingparamsbis.json', 'utf8')),function(err, newDoc){
    
});*/

    module.exports = function(app) {

        app.post('/api/testDB', function(req, res) { console.log(req); 

            scenariosDB.insert(req, function (err, newDoc) {   // Callback is optional 

            });
            
        });

        app.get('/api/buildingspos', function(req, res) {

            buildingposDB.find({},function(err, buildingspos) { 

                if (err)
                    res.send(err);

                res.json(buildingspos); 
            });
        });

        app.get('/api/buildingsmonthly/:id', function(req, res) { 

            var idnum = Number(req.params.id);
            buildingmonthlyDB.find({id:idnum},function(err, doc) {

                if (err)
                    res.send(err);

                res.json(doc);
            });
        });

        app.get('/api/buildingsnames', function(req, res) {

            buildingnamesDB.find({},function(err, buildingsnames) {

                if (err)
                    res.send(err);

                res.json(buildingsnames); 
            });
        });

        app.get('/api/zones', function(req, res) {

           zonesDB.find({},function(err, zones) {

                if (err)
                    res.send(err);

                res.json(zones); 
            });
        });



        app.get('/api/buildingsparams', function(req, res) {
            
           buildingparamsDB.find({},function(err, buildingsparams) { 
                if (err)
                    res.send(err);
                res.json(buildingsparams); 
            });
        });



       app.get('/api/buildingsparamsbis', function(req, res) {

           buildingparamsbisDB.find({},function(err, buildingsparamsbis) {


                if (err)
                    res.send(err);

                res.json(buildingsparamsbis); 
            });
        });

        app.get('/api/buildingsfloors', function(req, res) {

           buildingfloorsDB.find({},function(err, buildingsfloors) {

                if (err)
                    res.send(err);

                res.json(buildingsfloors); 
            });
        });

        var path = require('path');
        app.get('*', function(req, res) {
          res.sendFile(path.join(__dirname, '../public/views/index.html')); 
        });

    };