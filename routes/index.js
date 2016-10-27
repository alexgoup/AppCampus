var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
/*var Building = mongoose.model('Building');


router.get('/buildings', function(req, res, next) {
  Building.find(function(err, buildings){
    if(err){ return next(err); }

    res.json(buildings);
  });
});

router.post('/buildings', function(req, res, next) {
  var building = new Building(req.body);

  building.save(function(err, building){
    if(err){ return next(err); }

    res.json(building);
  });
});*/

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
