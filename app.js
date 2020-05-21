var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var requestIp = require('request-ip');
var session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);

var indexRouter = require('./routes/index');

var app = express();

// session stuff
var MONGO_URL = process.env.MONGO_URL;
var DB_NAME = process.env.DB_NAME;

app.use(session({
  secret: 'GODrocks',
  resave: false,
  saveUninitialized: true,
  store: new MongoDBStore({
    uri: MONGO_URL,
    databaseName: DB_NAME,
    collection: 'sessions'
  }),
  cookie: { 
    maxAge: null 
  }
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
// app.use('/users', usersRouter);

// IP address middleware
app.use(requestIp.mw())

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
  res.render('pages/error');
});



module.exports = app;
