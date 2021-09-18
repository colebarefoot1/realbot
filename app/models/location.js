var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var productSchema = new Schema({

  zip: { type: String},

  city: { type: String},

  state: { type: String},

  stateabbr: { type: String },

  type: { type: String },

  county: { type: String },

  areacode: { type: String },

  neighborhood: { type: String }

});
module.exports = mongoose.model('Locations', productSchema);

