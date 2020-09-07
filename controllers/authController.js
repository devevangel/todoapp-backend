const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('./../models/userModel');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

exports.signup = async (req, res, next) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    });

    const token = signToken(newUser._id);
    newUser.password = undefined;
    newUser.__v = undefined;

    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: newUser
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Could not sign user up.',
      error: err
    });
  }
};

exports.login = async (req, res, next) => {
  try {
    // Destructring req.body to gain access to the email and password in the body
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
      return next(new Error('Please provide email and password'));
    }

    // 2) Check if user exist and password is correct
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new Error('Incorrect email or password', 401));
    }

    // 3) If checks are passed, send token to client
    const token = signToken(user._id);
    user.password = undefined;
    user.__v = undefined;

    res.status(200).json({
      status: 'success',
      token,
      data: {
        user
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Could not log user in.',
      error: err
    });
  }
};

exports.protect = async (req, res, next) => {
  let token = '';
  // 1) Get Token and check if it exist
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  // Check if token exists
  if (!token) {
    return next(
      new Error('You are not logged in. Please login to get access.')
    );
  }

  // 2) Validate Token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new Error('User not found.'));
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
};
