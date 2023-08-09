const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const passport = require('./config/passport');
const indexRouter = require('./routes/index');
const connection = require('./config/database');

const PORT = 3000;
const app = express();
mongoose.set('strictQuery', false);
//public directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
//view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(
  session({
    secret: 'secret-key', // Cambia esto a una clave secreta fuerte
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

//routes
app.use('/', indexRouter);
main().catch((err) => console.log(err));

async function main() {
  await connection();

  app.listen(PORT, () =>
    console.log(`App listening on http://localhost:${PORT}`)
  );
}
