const debug = require('debug')('estarwars:config:passport');
const User = require('../models/user');

module.exports = function(app, passport, passportLocal) {
  passport.use(new passportLocal.Strategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
  }, function callback(req, email, password, done) {
    User.findOne({ email: email }, function cb(err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, null); }
      if (!user.validPassword(password)) {
        debug('wrong password : ', password);
        return done(null, false);
      }
      return done(null, user);
    });
  }));

  passport.serializeUser(function callback(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function callback(user, done) {
    User.findOne({ _id: user._id}, done);
  });

  app.post('/login', function callback(req, res, next) {
    passport.authenticate('local', function cb(err, user) {
      if (err) {
        debug(err);
        return next(err);
      }

      if (!user) {
        debug('error', 'Vos identifiants ne correspondent pas.');
        return res.redirect('/login');
      }

      req.login(user, function cb2(error) {
        if (error) {
          debug(err);
          return next(error);
        }
        return res.redirect('/');
      });
    })(req, res, next);
  });
};
