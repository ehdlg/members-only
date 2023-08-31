const asyncHandler = require('express-async-handler');
const Message = require('../models/message');

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

const isNotAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
};

const isNotMember = (req, res, next) => {
  if (req.isAuthenticated() && !req.user.membership) {
    return next();
  }

  if (!req.isAuthenticated()) {
    res.redirect('/');
    return;
  }

  res.redirect('/login');
};

const isMember = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }

  if (!req.user.membership) {
    return res.redirect('/upgrade');
  }

  return next();
};

const isNotAdmin = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }

  if (req.user.admin) {
    return res.redirect('/');
  }

  return next();
};

const checkMessageOwnership = asyncHandler(async (req, res, next) => {
  const message = await Message.findById(req.params.id).populate('user').exec();

  if (!message) {
    return res.redirect('/posts');
  }

  if (req.path.includes('/delete')) {
    // Para el caso de delete, continúa si es propietario o administrador
    if (
      message.user._id.toString() !== req.user._id.toString() &&
      !req.user.admin
    ) {
      return res.redirect('/');
    }
  } else if (req.path.includes('/update')) {
    // Para el caso de update, solo permite continuar si es el propietario
    if (message.user._id.toString() !== req.user._id.toString()) {
      return res.redirect('/');
    }
  }

  req.message = message;
  return next();
});

module.exports = {
  isAuthenticated,
  isNotAuthenticated,
  isNotMember,
  checkMessageOwnership,
  isNotAdmin,
};
