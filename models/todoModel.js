const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Todo must belong to a user.']
  },
  title: {
    required: [true, 'Todo title is required.'],
    type: String,
    maxlength: [50, 'Title can no exceed 50 characters.']
  },
  summary: {
    type: String,
    required: [true, 'Todo summary is required.'],
    maxlength: [100, 'Summary can not exceed 100.']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;
