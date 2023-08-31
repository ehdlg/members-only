const User = require('../models/user');
const asyncHandler = require('express-async-handler');
const validation = require('../utils/validation');
const { validationResult } = require('express-validator');
const { generatePassword, validPassword } = require('../utils/passwordUtils');
const passport = require('../config/passport');

exports.user_create_get = (req, res, next) => {
  res.render('register', { title: 'New User', user: false, errors: false });
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
      membership: req.body.secret ? true : false,
    });

    if (!errors.isEmpty()) {
      res.render('register', {
        title: 'Register',
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

exports.user_update_get = (req, res, next) => {
  res.render('user_update', {
    title: 'Update Profile',
    user: req.user,
    errors: false,
  });
};

exports.user_update_post = [
  validation.validateUpdate,
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const user = new User({
      username: req.body.username,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      admin: req.body.admin ? true : false,
      membership: req.body.membership ? true : false,
      _id: req.user._id,
    });
    if (!errors.isEmpty()) {
      res.render('user_update', {
        title: 'Update Profile',
        user,
        errors: errors.array(),
      });
    } else {
      await User.findByIdAndUpdate(req.user._id, user, { new: true });
      res.redirect('/profile');
    }
  }),
];

exports.user_upgrade_get = (req, res, next) => {
  res.render('upgrade', { title: 'Upgrade account', errors: false });
};

exports.user_upgrade_post = [
  validation.validateUpgrade,
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('upgrade', {
        title: 'Upgrade account',
        errors: errors.array(),
      });
    } else {
      await User.findByIdAndUpdate(
        res.locals.user._id,
        { membership: true },
        { new: true }
      );
      res.redirect('/');
    }
  }),
];

exports.user_profile_get = (req, res, next) => {
  res.render('profile', { title: 'Profile' });
};

exports.user_admin_get = (req, res, next) => {
  res.render('admin_update', { title: 'Update to Admin' });
};

exports.user_admin_post = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(
    res.locals.user._id,
    { admin: true },
    { new: true }
  );

  res.redirect('/');
});
