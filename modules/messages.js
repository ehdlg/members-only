const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

const MessageSchema = new Schema({
  title: { type: String, required: true, maxLength: 300 },
  timestamp: { type: Date, default: Date.now },
  text: { type: String, required: true },
});

module.exports = mongoose.model('Message', MessageSchema);
