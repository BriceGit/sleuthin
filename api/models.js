let mongoose = require('mongoose');
const {Schema} = require('mongoose');

const UserSchema = new mongoose.Schema({
  //_id added automatically
  username: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  openCases: {
    type: [{type: Schema.Types.ObjectId, ref: 'Case'}],
    required: true
  },

  casesWorkingOn: {
    type: [{type: Schema.Types.ObjectId, ref: 'Case'}],
    required: true
  },

  casesHelpedSolve: {
    type: [{type: Schema.Types.ObjectId, ref: 'Case'}],
    required: true
  },

  comments: {
    type: [{type: Schema.Types.ObjectId, ref: 'Comment'}],
    required: true
  }

})

const CaseSchema = new mongoose.Schema({
  //_id added automatically
  client: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  title: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  clues: {
    type: [{type: String}],
    required: true
  },

  solved: {
    type: Boolean,
    required: true
  }


})

const CommentSchema = new mongoose.Schema({
  //_id added automatically
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },

  text: {
    type: String,
    required: true
  }
})

const User = new mongoose.model('User', UserSchema);

const Case = new mongoose.model('Case', CaseSchema);

const Comment = new mongoose.model('Comment', CommentSchema);

exports.User = User;
exports.Case = Case;
exports.Comment = Comment;
