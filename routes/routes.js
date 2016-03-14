
module.exports.routes = function(app){


var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var cheerio = require("cheerio");
var request = require("request");
var logger = require('morgan');
var expressHandlebars = require("express-handlebars");


var Article = require('../models/articleModel');
var Note = require('../models/noteModel');

  app.get('/', function(req,res){
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
  res.render('index');
  });


  app.get('/articles', function(req,res){
    Article.find({}, function(err, dbArticles){
      if (err){
        res.send(err);
      } else {
        res.send(dbArticles);
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
        Note.findOneAndUpdate({"_id": dbNote._id}, {$set: {'_articleId' : req.body.articleId}}, function(err,ArticleNotes) {
        if (err) {
          res.send(err);
        } else 
        res.send(articleNotes);
        });
        });
      }
    });
  });
};