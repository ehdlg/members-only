const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  membership: { type: Boolean, default: false },
  admin: { type: Boolean, default: false },
});

module.exports = mongoose.model('User', UserSchema);
