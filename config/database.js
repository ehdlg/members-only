const mongoose = require('mongoose');
require('dotenv').config();

const mongoDb = process.env.MONGO_URL;

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
