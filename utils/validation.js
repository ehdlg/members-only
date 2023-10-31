const { body } = require('express-validator');
const User = require('../models/user');
require('dotenv').config();

exports.validateUser = [
  body('first_name', 'First name must not be empty')
    .trim()
    .isLength({ min: 1 }),
  body('last_name', 'Last name must not be empty').trim().isLength({ min: 1 }),
  body('username', 'Username must not be empty')
    .trim()
    .isLength({ min: 1 })
    .custom(async (value, { req }) => {
      const user = await User.findOne({ username: value });
      if (user) {
        throw new Error('Username already taken');
      }
      return true;
    }),
  body('password', 'Password must have at least 6 characters')
    .trim()
    .isLength({ min: 6 })
    .escape(),
  body('email', 'Invalid email address')
    .trim()
    .isEmail()
    .normalizeEmail()
    .custom(async (value) => {
      const user = await User.findOne({ email: value });
      if (user) {
        throw new Error('Email is already in use');
      }
      return true;
    }), // Validate email
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    })
    .escape(),
  body('secret').custom((value) => {
    if (value === '' || value === process.env.SECRET_MEMBER_PASSWORD) {
      return true;
    }
    throw new Error(
      'The secret password is not correct! Try again or leave it blank'
    );
  }),
];

exports.validateLogin = [
  body('username', 'Username must not be empty')
    .trim()
    .isLength({ min: 1 })
    .custom(async (value) => {
      const user = await User.findOne({ username: value });
      if (!user) {
        throw new Error('User does not exist');
      }
      return true;
    }),
  body('password', 'Password must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),
];

exports.validateUpgrade = [
  body('secret', 'Please, enter a password')
    .isLength({ min: 1 })
    .escape()
    .custom((value) => {
      if (value !== process.env.SECRET_MEMBER_PASSWORD) {
        throw new Error(
          "That's not the secret password for becoming a member password! Try again"
        );
      }
      return true;
    }),
];

exports.validateAdmin = [
  body('secret', 'Please, enter the admin secret password')
    .isLength({ min: 1 })
    .escape()
    .custom((value) => {
      if (value !== process.env.SECRET_ADMIN_PASSWORD) {
        throw new Error(
          "That's not the secret password for becoming an admin! Try again"
        );
      }
      return true;
    }),
];

exports.validateMessage = [
  body('title')
    .notEmpty()
    .withMessage('Title must not be empty')
    .isLength({ max: 300 })
    .withMessage('Title must not exceed 300 characters')
    .escape(),
  body('text')
    .notEmpty()
    .withMessage('Message text must not be empty')
    .escape(),
];

exports.validateUpdate = [
  body('first_name', 'First name must not be empty')
    .trim()
    .isLength({ min: 1 }),
  body('last_name', 'Last name must not be empty').trim().isLength({ min: 1 }),
  body('username', 'Username must not be empty')
    .trim()
    .isLength({ min: 1 })
    .custom(async (value, { req }) => {
      if (req.user.username !== value) {
        const repeatedUsername = await User.findOne({ username: value }).exec();
        if (repeatedUsername) {
          throw new Error('The username is already taken');
        }
      }

      return true;
    }),

  body('email', 'Invalid email address')
    .trim()
    .isEmail()
    .normalizeEmail()
    .custom(async (value, { req }) => {
      if (req.user.email !== value) {
        const repeatedEmail = await User.findOne({ email: value }).exec();
        if (repeatedEmail) {
          throw new Error('Email is already in use');
        }
      }
      return true;
    }),
];
