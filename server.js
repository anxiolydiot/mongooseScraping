var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var cheerio = require("cheerio");
var request = require("request");
var logger = require('morgan');
var expressHandlebars = require("express-handlebars");
var app = express();
var PORT = process.env.PORT || 3000;


app.use(logger('dev'));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(express.static('public'));



//Database configuration
mongoose.connect('mongodb://localhost/week18homework');
var db = mongoose.connection;

db.on('error', function(err) {
  console.log('Mongoose Error: ', err);
});
db.once('open', function() {
  console.log('Mongoose connection successful.');
});

var Article = require('./models/articleModel');
var Note = require('./models/noteModel');

app.get('/', function(req,res){
  request('https://news.ycombinator.com', function (error, response, html) {
    if (!error && response.statusCode == 200) {
      var $ = cheerio.load(html);
      var result = [];
      $('span.comhead').each(function(i, element){
        var a = $(this).prev();
        var rank = a.parent().parent().text();
        var title = a.text();
        var url = a.attr('href');
        var subtext = a.parent().parent().next().children('.subtext').children();
        var points = $(subtext).eq(0).text();
        var username = $(subtext).eq(1).text();
        var comments = $(subtext).eq(2).text();
        result.push({articleData : {rank: parseInt(rank),
          title: title,
          url: url,
          points: parseInt(points),
          username: username,
          comments: parseInt(comments)} });
        var saveArticle = new Article({
          result:result
        });
        saveArticle.save(function(err,dbArticle) {
          if (err) {
            console.log(err);
          } else { 
            console.log(dbArticle);
          }
        });

      });
      res.render(index);
    }
    
  });

});


app.post('/submit', function(req,res){
    var newNote =  new Note(req.body);
    newNote.save(function(err,dbNote) {
      if (err) {
        res.send(err);
      } else {
      Article.findOneAndUpdate({
        "_id" : req.body.articleid},
        {$push: {'notes': dbNote._id}}, {new: true}, function(err, articleNotes){
        if (err) {
        res.send(err);
      } else {
      res.send(articleNotes);  
      }

      });
    }
  });
});
  






// connection.sync().then(function() {
    app.listen(PORT, function() {
        console.log("Application is listening on PORT %s", PORT);
    // });
});
