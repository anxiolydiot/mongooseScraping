
var bodyParser = require('body-parser');
var cheerio = require('cheerio'); // scrapes - allows us to use jquery syntax to parse a lot of data
var express = require('express');
var expressHandlebars = require('express-handlebars');
var mongoose = require('mongoose');
var request = require('request'); // gives us the ability to make web requests
var logger = require('morgan'); // logs activity in the terminal
var app = express();
var PORT = process.env.PORT || 3000;
var routes = require('./routes/routes.js');

app.engine('handlebars', expressHandlebars({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

app.use(logger('dev'));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(express.static('public'));

routes.routes(app);


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



// connection.sync().then(function() {
    app.listen(PORT, function() {
        console.log("Application is listening on PORT %s", PORT);
    // });
});
