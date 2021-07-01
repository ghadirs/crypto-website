var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CryptoSchema = new Schema(
  {
    name: {type: String, required: true, maxLength: 100},
    price: {type: String, required: true, maxLength: 100},
    copacity: {type: String, required: true, maxLength: 100}
  }
);

// Virtual for author's URL
CryptoSchema
.virtual('url')
.get(function () {
  return '/menu/cryptos/' + this._id;
});

//Export model
module.exports = mongoose.model('Crypto', CryptoSchema);
