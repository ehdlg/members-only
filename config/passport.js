const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const bcrypt = require('bcrypt');

const strategy = new LocalStrategy(async (username, password, done) => {
  try {
    const user = await User.findOne({ username: username }); //get user from db
    if (!user) {
      //user not found
      return done(null, false, { message: 'User not found' });
    }
    const passwordMatch = bcrypt.compareSync(password, user.password); // boolean
    if (passwordMatch) {
      // password match
      return done(null, user);
    } else {
      return done(null, false, { message: 'Password is not correct' });
    }
  } catch (err) {
    return done(err);
  }
});

passport.use(strategy);

module.exports = passport;
