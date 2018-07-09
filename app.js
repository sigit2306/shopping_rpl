var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressHbs = require('express-handlebars');
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var validator = require('express-validator');
var MongoStore = require('connect-mongo')(session);
var formatCurrency = require('format-currency');

var userRouter = require('./routes/user');
var indexRouter = require('./routes/index');

var app = express();

// connect to local mongodb, database: shopping
//mongoose.connect('mongodb://localhost/shopping');
var mongoDB = process.env.MONGODB_URI || 'mongodb://your_username1:your_password1@ds131551.mlab.com:31551/shopping_test';
mongoose.connect(mongoDB);
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", function () {
	console.log("We are connected to shopping db");
});

// require without passing it to a variable
require('./config/passport');

// setting up middleware
  // ||view engine setup
app.engine('.hbs', expressHbs({
  defaultLayout: 'layout', 
  extname: '.hbs'
}));
app.set('view engine', '.hbs');

  // ||more middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());

  // ||use sessions for tracking logins
app.use(session({
  secret: 'mysupersecret', 
  resave: false, 
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  }),
  cookie: { maxAge: 180 * 60 * 1000 } // this will make the MongoStore available for 3 hours
}));
  
  // || more middleware
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

  // ||setting global variable that can be accessed by all response (res)
app.use(function (req, res, next) {
  res.locals.login = req.isAuthenticated(); // isAuthenticated is one of passport function
  res.locals.session = req.session;
  res.locals.userLogged = req.user || null;
  next();
});

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/faq', function (req, res, next) {
  res.render('faq', { title : 'Usaha Rumah tangga' });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Tidak ditemukan');
  err.status = 404;
  next(err);
});

// error handler

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', { 
      message: err.message, error: err 
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
