var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ArticleSchema = new Schema(
  {
    title: {type: String, required: true, maxLength: 100},
    author: {type: String, required: false, maxLength: 100},
    text: {type: String, required: true, maxLength: 2024}
  }
);

// Virtual for author's URL
ArticleSchema
.virtual('url')
.get(function () {
  return '/menu/articles/' + this._id;
});

//Export model
module.exports = mongoose.model('Article', ArticleSchema);