const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'User name is required.']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email.'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email.']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password.'],
    minlength: 8,
    select: false
  }
});

/**
 * -----Document pre Hook-----
 * Works between getting the data and saving it to the DB.
 * handles password hashing before saving doc to DB.
 * Checks to see if the user has not been modified and exits function
 * hash password if it is not modified with a cost of 13
 * Set the passwordConfrim field to undefined
 */
userSchema.pre('save', async function(next) {
  // Checks to see if the user has not been modified and exits function
  if (!this.isModified('password')) return next();

  // hash password if it is not modified with a cost of 13
  this.password = await bcrypt.hash(this.password, 12);

  next();
});

/**
 * -----Instance Method----
 * This function is avaliable to all user doument instances
 * Checks if password in body of request equals the password of the currently selected user, and returns true or false
 * @param {candidatePassword} candidatePassword
 * @param {userPassword} userPassword
 */
userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
