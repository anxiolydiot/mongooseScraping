
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
  rank: {
    type: Number,
    unique:false
  },
  title: {
    type: String,
    unique:true
  },
  url: {
    type: String,
    unique:true
  },
  points: {
    type: Number,
    unique:false
  },
  username: {
    type: String,
    unique:true
  },
  comments: {
    type: Number,
    unique:false
  },
  notes: [{
      type: Schema.Types.ObjectId,
      ref: 'Note'
  }]
});

var Article = mongoose.model('Article', ArticleSchema);
module.exports = Article;