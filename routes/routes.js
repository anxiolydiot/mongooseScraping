var controller = require('../controller/controller.js');
 
 module.exports.routes = function(app){
 
 app.get('/', controller.main);
 
 app.get('/articles', controller.getArticles);
 
 app.post('/notes', controller.Notes);
 
 app.post('/newNote', controller.newNote);

 app.post('/rmNote', controller.rmNote);


};