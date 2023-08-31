const User = require('../models/user');
const Message = require('../models/message');
const asyncHandler = require('express-async-handler');
const validation = require('../utils/validation');
const { validationResult } = require('express-validator');

exports.message_list_get = asyncHandler(async (req, res, next) => {
  const messages = await Message.find().populate('user').exec();

  res.render('posts', { title: 'Post list', messages });
});

exports.message_detail_get = asyncHandler(async (req, res, next) => {
  const message = await Message.findById(req.params.id).populate('user').exec();

  if (!message) {
    return res.sendStatus(404);
  }

  res.render('message_detail', {
    title: 'Message details',
    message,
  });
});

exports.message_new_get = (req, res, next) => {
  res.render('message_form', {
    title: 'New message',
    errors: false,
    message: false,
    action: 'Create a new Message for the Club',
  });
};

exports.message_new_post = [
  validation.validateMessage,
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const message = new Message({
      title: req.body.title,
      text: req.body.text,
      user: res.locals.user._id,
    });

    if (!errors.isEmpty()) {
      res.render('message_form', {
        title: 'New message',
        errors: errors.array(),
        message,
        action: 'Create a new Message for the Club',
      });
    } else {
      await message.save();
      res.redirect('/posts');
    }
  }),
];

exports.message_update_get = asyncHandler(async (req, res, next) => {
  const message = req.message;

  if (!message) {
    return res.sendStatus(404);
  }

  req.message = message;
  res.render('message_form', {
    title: 'Update Message',
    message,
    errors: false,
    action: 'Edit your message',
  });
});

exports.message_update_post = [
  validation.validateMessage,

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const updatedMessage = new Message({
      title: req.body.title,
      text: req.body.text,
      timestamp: req.message.timestamp,
      user: req.message.user,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      res.render('message_form', {
        title: 'Update Message',
        message: updatedMessage,
        errors: errors.array(),
        action: 'Edit your message',
      });
    } else {
      await Message.findByIdAndUpdate(req.params.id, updatedMessage, {});
      res.redirect('/posts');
    }
  }),
];

exports.message_delete_get = asyncHandler(async (req, res, next) => {
  const message = await Message.findById(req.params.id).populate('user').exec();
  res.render('message_delete', { title: 'Delete Message', message });
});

exports.message_delete_post = asyncHandler(async (req, res, next) => {
  await Message.findByIdAndDelete(req.params.id);
  res.redirect('/posts');
});
