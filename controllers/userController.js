const User = require('../models/user');
const Message = require('../models/message');
const asyncHandler = require('express-async-handler');
const validation = require('../utils/validation');
const { validationResult } = require('express-validator');
const { generatePassword, validPassword } = require('../utils/passwordUtils');
const passport = require('../config/passport');

exports.user_create_get = (req, res, next) => {
  res.render('user_form', { title: 'New User', user: false, errors: false });
};

exports.user_create_post = [
  validation.validateUser,
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const hashedPwd = generatePassword(req.body.password);

    const user = new User({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      username: req.body.username,
      email: req.body.email,
      password: hashedPwd,
    });

    if (!errors.isEmpty()) {
      res.render('user_form', {
        title: 'Create User',
        user,
        errors: errors.array(),
      });
    } else {
      await user.save();
      res.redirect('/login');
    }
  }),
];

exports.user_login_get = async (req, res, next) => {
  res.render('login', { title: 'Login', user: false, errors: false });
};

exports.user_login_post = [
  validation.validateLogin,
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render('login.ejs', {
        title: 'Login',
        user: false,
        errors: errors.array(),
      });
    } else {
      passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
      })(req, res, next);
    }
  }),
];

exports.user_logout_get = asyncHandler(async (req, res, next) => {
  req.logout(() => {
    res.redirect('/');
  });
});
