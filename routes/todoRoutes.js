const express = require('express');
const authController = require('./../controllers/authController');
const todoController = require('./../controllers/todoController');

const router = express.Router();

router
  .route('/')
  .get(authController.protect, todoController.getMyTodos)
  .post(authController.protect, todoController.createTodo);

router
  .route('/:id')
  .patch(authController.protect, todoController.updateTodo)
  .delete(authController.protect, todoController.deleteTodo);

module.exports = router;
