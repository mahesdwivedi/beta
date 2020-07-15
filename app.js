var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieSession = require("cookie-session");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var passport = require("passport");
var indexRouter = require("./routes/index");
var algoRouter = require("./routes/algo");
var usersRouter = require("./routes/users");
const passportSetup = require("./config/passport-setup");
var authRouter = require("./routes/auth-routes");
var cors = require("cors");
var app = express();
var session = require("express-session");
//db connection
var mongoose = require("mongoose");
var mongoDB = "mongodb://127.0.0.1:27017/notice";
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
// app.use(session({ secret: "cats" }));

//passport intialise

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "YOUR-DOMAIN.TLD"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(cors());
app.use(express.static('public'))
app.use(session({ secret: "keyboardcat" }));
app.use(passport.initialize());
app.use(passport.session());

app.use("/", indexRouter);
// app.use("/new", authRouter);
app.use("/users", usersRouter);
app.use("/auth", authRouter);
app.use("/algo", algoRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
