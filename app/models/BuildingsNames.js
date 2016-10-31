var mongoose = require('mongoose');

/*var BuildingSchema = new mongoose.Schema({
  title: String,
  cost: Number
});
*/
module.exports = mongoose.model('BuildingNames', new mongoose.Schema({}),'buildingsnames');

