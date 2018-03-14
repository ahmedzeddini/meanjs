var express = require('express');
var path = require('path');

var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var userRoutes = require('./routes/user');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var config = require('./config/database');


var cors = require('cors');

var session = require('express-session');
var flash = require('connect-flash');




mongoose.connect(config.database)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));


var app = express();


app.use(cors());

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}));
app.use(flash());


app.use(express.static(path.join(__dirname, 'public')));

app.use('/',userRoutes);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
