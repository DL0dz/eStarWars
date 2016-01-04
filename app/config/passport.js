const debug = require('debug')('estarwars:config:passport');

module.exports = function(app, passport, passportLocal) {
  passport.use(new passportLocal.Strategy(function callback(username, password, done) {
    // done(new Error('ouch !'));
    if (username === password) {
      done(null, {id: username, name: username});
    } else {
      done(null, null);
    }
  }));

  passport.serializeUser(function callback(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function callback(user, done) {
    // User.findOne({ _id: user._id}, done);
    done(null, user);
  });

  app.post('/login', function callback(req, res, next) {
    passport.authenticate('local', function cb(err, user) {
      if (err) {
        debug(err);
        return next(err);
      }

      if (!user) {
        debug('error', 'Désolé vos identifiants ne correspondent pas.');
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
