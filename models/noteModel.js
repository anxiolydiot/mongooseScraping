
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Article = require('./articleModel');


var NoteSchema = new Schema({
  note: {
    type:String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

var rmNote = function(id){
  return Note.findOne({
    _id: id
  }, function(err, note){
    note.remove();
  });
};


NoteSchema.post('remove', function(){
  Article.Article.remove({'notes':this._id}).exec();
});

var Note = mongoose.model('Note', NoteSchema);
module.exports = Note;
exports.rmNote = rmNote;