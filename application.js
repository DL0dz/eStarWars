const env = require('node-env-file');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const errorhandler = require('errorhandler');
const express = require('express');
const app = express();
const passport = require('passport');
const passportLocal = require('passport-local');

app.set('views', './app/views');
app.set('view engine', 'jade');

app.use(express.static('./public'));

if (process.env.NODE_ENV !== 'production') {
  env('app/.env');
  app.use(morgan('dev'));
  app.use(errorhandler({dumpExceptions: true, showStack: true}));
}

app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


require('./app/models/connection');

app.use('/', require('./app/controllers/user'));
app.use('/', require('./app/controllers/product'));
app.use('/', require('./app/controllers/contact'));


// Errors handling

// catch 404 and forward to error handler
app.use(function error404(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Development : will print stacktrace
if (process.env.NODE_ENV !== 'production') {
  app.use(function printStacktrace(err, req, res, next) { // eslint-disable-line no-unused-vars
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
    });
  });
}
// Production : no stacktraces leaked to user
app.use(function noStacktrace(err, req, res, next) { // eslint-disable-line no-unused-vars
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {status: err.status},
  });
});

module.exports = app;
