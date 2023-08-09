const mongoose = require('mongoose');
const mongoDb = 'mongodb://localhost:27017/members-only';

const connection = async () => {
  try {
    await mongoose.connect(mongoDb, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (err) {
    console.error('Error connecting to MongoDB', err.meesage);
  }
};

module.exports = connection;
