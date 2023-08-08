const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const indexRouter = require('./routes/index');

const PORT = 3000;
const mongoDb = 'mongodb://localhost:27017/members-only';
const app = express();
mongoose.set('strictQuery', false);
//public directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
//view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//routers
app.use('/', indexRouter);
main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(mongoDb, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  app.listen(PORT, () =>
    console.log(`App listening on http://localhost:${PORT}`)
  );
}
