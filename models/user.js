var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema(
  {
    username: {type: String, required: true, maxLength: 100},
    email: {type: String, required: true, maxLength: 100},
    password: {type: String, required: true, maxLength: 100},
    mobile: {type: Number , required: true, maxLength: 12}
  }
);

// // Virtual for author's full name
// UserSchema
// .virtual('name')
// .get(function () {
//   return this.family_name + ', ' + this.first_name;
// });

// Virtual for author's URL
UserSchema
.virtual('url')
.get(function () {
  return '/users/' + this._id;
});

//Export model
module.exports = mongoose.model('User', UserSchema);
