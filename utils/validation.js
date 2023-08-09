const { body } = require('express-validator');

exports.validateUser = [
  body('first_name', 'First name must not be empty')
    .trim()
    .isLength({ min: 1 }),
  body('last_name', 'Last name must not be empty').trim().isLength({ min: 1 }),
  body('username', 'Username must not be empty').trim().isLength({ min: 1 }),
  body('password', 'Password must have at least 6 characters')
    .trim()
    .isLength({ min: 6 })
    .escape(),
  body('email', 'Invalid email address').trim().isEmail().normalizeEmail(), // Validate email
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    })
    .escape(),
];
