var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({

  firstName: { type: String},

  lastName: { type: String},

  email : { type: String},

  subscriber: {
    type: mongoose.Schema.ObjectId,
    ref: 'subscriber',
    required: true,
  },

});
module.exports = mongoose.model('User', productSchema);

