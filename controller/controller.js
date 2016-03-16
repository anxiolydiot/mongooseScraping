var Article = require('../models/articleModel');
var Note = require('../models/noteModel');

exports.main = function (req,res){
  Article.scrapes();
  res.render('index');
};

exports.getArticles = function(req,res){
  Article.findArticles().then(function(articles) {
    res.json(articles);
  });
};

exports.newNote = function (req,res){
  var note = new Note.Note({
    note: req.body.note,
  });
  note.save(function(err,note){
    if(err){
      throw (err);

    }
    Article.getNotes(req.body.articleId, note);
    res.send({});
  });
};

exports.Notes = function(req,res){
  Article.getNotes(req.body.articleId).then(function(reScrape){
    res.json(reScrape);
  });
};

exports.rmNote = function(req,res){
  Note.rmNote(req.body.noteId).then(function(){
    res.send({});
  });
};