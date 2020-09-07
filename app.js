const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

//Router
const userRouter = require('./routes/userRoutes');
const todoRouter = require('./routes/todoRoutes');

const app = express();

// 1) GLOBAL Middlewares
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

app.use(cors());
// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers.authorization);
  next();
});

//Routes
app.use('/api/v1/users', userRouter);
app.use('/api/v1/todos', todoRouter);

// Handling unsupported routes
app.all('*', (req, res, next) => {
  next(new Error('Something went really wrong.'));
});

// Global express error handler middleware
app.use((err, req, res, next) => {
  res.status(500).json({
    status: 'fail',
    message: err.message ? err.message : 'Something went reall wrong.',
    error: err
  });
});

module.exports = app;
