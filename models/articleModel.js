
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
  name: {
    type: String,
    unique:true
  },
  notes: [{
      type: Schema.Types.ObjectId,
      ref: 'Note'
  }]
});

var Article = mongoose.model('Article', ArticleSchema);
module.exports = Article;