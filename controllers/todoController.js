const Todo = require('./../models/todoModel');

exports.createTodo = async (req, res, next) => {
  try {
    const newTodo = await Todo.create({
      user: req.body.user,
      title: req.body.title,
      summary: req.body.summary
    });

    newTodo.__v = undefined;

    res.status(201).json({
      status: 'success',
      data: {
        todo: newTodo
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message ? err.message : 'Error creating todo.',
      err
    });
  }
};

exports.updateTodo = async (req, res, next) => {
  try {
    const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!todo) {
      return next(new Error('No todo found with that ID'));
    }

    res.status(200).json({
      status: 'success',
      data: {
        todo
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message ? err.message : 'Error updating todo.',
      err
    });
  }
};

exports.deleteTodo = async (req, res, next) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);

    if (!todo) {
      return next(new Error('No todo found with that ID'));
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message ? err.message : 'Error updating todo.',
      err
    });
  }
};

exports.getMyTodos = async (req, res, next) => {
  try {
    const todos = await Todo.find({ user: req.user._id }).sort('-createdAt');

    res.status(200).json({
      status: 'success',
      results: todos.length,
      data: {
        todos
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message ? err.message : 'Could not find your todos.',
      err
    });
  }
};
