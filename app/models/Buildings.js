var mongoose = require('mongoose');

var BuildingSchema = new mongoose.Schema({
  title: String,
  cost: Number
});

var Building = mongoose.model('Building', BuildingSchema);

