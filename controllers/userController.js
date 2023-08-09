const User = require('../models/user');
const Message = require('../models/message');
const asyncHandler = require('express-async-handler');
const validation = require('../utils/validation');

exports.user_create_get = async (req, res, next) => {
  res.render('user_form', { title: 'New User' });
};

exports.user_create_post = [
  validation.validateUser,
  asyncHandler(async (req, res, next) => {}),
];
