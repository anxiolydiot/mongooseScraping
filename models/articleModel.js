var request = require('request');
var cheerio = require('cheerio');
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

var scrapes = function(){
  request('https://news.ycombinator.com', function (error, response, html) {
      if (!error && response.statusCode == 200) {
        var $ = cheerio.load(html);
        // var result = [];
        $('span.comhead').each(function(i, element){
          var a = $(this).prev();
          var rank = a.parent().parent().text();
          var title = a.text();
          var url = a.attr('href');
          var subtext = a.parent().parent().next().children('.subtext').children();
          var points = $(subtext).eq(0).text();
          var username = $(subtext).eq(1).text();
          var comments = $(subtext).eq(2).text();
          var parsedScrape = new Article({
            rank: parseInt(rank),
            title: title,
            url: url,
            points: parseInt(points),
            username: username,
            comments: parseInt(comments)

          });

          parsedScrape.save(function(err,dbArticle) {
            if (err) {
              console.log(err);
            } else { 
              console.log(dbArticle);
            }
          });

        });
      
      }
  });
};


var findArticles = function(){
  return Article.find({});
};



var addNote = function(articleId, note){
  Article.findOneAndUpdate({
    _id: articleId
  },
  {
    $push: {
      'notes' : note._id
    }
  },
  {
   new: true
  }, function(err, noteAdded){
  if (err) {
    throw err;
  }
 });
};

var getNotes = function(articleId){
  return Article
    .findOne({_id: articleId})
    .populate('notes')
    .exec(function(err, reScrape){
      if (err) return handleError(err);
    });
};


var Article = mongoose.model('Article', ArticleSchema);
module.exports = Article;
exports.scrapes = scrapes;
exports.findArticles = findArticles;
exports.addNote = addNote;
exports.getNotes= getNotes;