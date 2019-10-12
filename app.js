var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieSession = require('cookie-session');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport');
var indexRouter = require('./routes/index');
var algoRouter = require('./routes/algo');
var usersRouter = require('./routes/users');
const passportSetup = require('./config/passport-setup');
var authRouter = require("./routes/auth-routes") 
var app = express();
var token = require("./config/passport-setup")
//db connection
var mongoose = require('mongoose');
var mongoDB = 'mongodb://127.0.0.1:27017/notice';
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//passport intialise
app.use(passport.initialize());
app.use(passport.session());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: ["qwefgfds"]
  })
);
// app.use(function (req, res, next) {
//   console.log(token.token)
//   console.log("---------------")
//   req.headers.authorization = token.token
//   next()
// })
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/algo', algoRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
