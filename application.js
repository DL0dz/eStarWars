const bodyParser = require('body-parser');
const compress = require('compression');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const env = require('node-env-file');
const errorhandler = require('errorhandler');
const express = require('express');
const logger = require('morgan');
// const multer = require('multer');
const passport = require('passport');

const app = express();

if (process.env.NODE_ENV !== 'production') {
  env('app/.env');
}

// Configure app
app.set('views', './app/views');
app.set('view engine', 'jade');

// GZIP Compression
app.use(compress());

// app.use(favicon(Path.join(__dirname, './app/assets', 'favicon.ico')));
app.use(express.static('./public'));

if (process.env.NODE_ENV !== 'production') {
  app.use(logger('dev'));
} else {
  app.use(logger('common'));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
// app.use(multer({
//   dest: './uploads',
//   limits: {
//     fieldNameSize: 100,
//     files: 2,
//     fields: 5,
//   },
// }));
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(cookieSession({
  key: 'frk.sess',
  secret: process.env.SESSION_SECRET,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
  },
}));
app.use(passport.initialize());
app.use(passport.session());

// Local variables
app.use(function setLocals(req, res, next) {
  app.locals.query = req.query;
  app.locals.url = req.url;
  app.locals.user = req.user;
  app.locals.env = process.env.NODE_ENV;
  next();
});

app.locals.title = 'The Force Revenges';

if (process.env.NODE_ENV !== 'production') {
  app.use(errorhandler({dumpExceptions: true, showStack: true}));
  app.locals.pretty = true;
}

require('./app/models/connection');
// require('./app/views/helpers')(app.locals);

// app.use('/contact', require('./app/controllers/contacts'));
// app.use('/', require('./app/controllers/redirects'));
app.use('/', require('./app/controllers/home'));
// app.use('/', require('./app/controllers/users'));
// app.use('/', require('./app/controllers/talkie'));
// app.use('/inbox', require('./app/controllers/inbox'));
// app.use('/', require('./app/controllers/search'));
// app.use('/notifications', require('./app/controllers/notifications'));
// app.use('/signup', require('./app/controllers/signup'));
// app.use('/', require('./app/controllers/sponsorship'));
// app.use('/share', require('./app/controllers/share'));
// app.use('/', require('./app/controllers/tags'));
// app.use('/api/portfolio', require('./app/controllers/portfolio'));
// app.use('/', require('./app/controllers/popins'));

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

