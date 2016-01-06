const debug = require('debug')('estarwars:controllers:user');
const express = require('express');
const router = module.exports = new express.Router();
const User = require('../models/user');

function createUser(req, res) {
  const newUser = new User({
    firstname: 'b',
    lastname: 'b',
    email: 'b@b.b',
    admin: true,
    address: {
      street: 'dantoin',
      zip: '12345',
      city: 'somewhere',
      state: 'alliance',
    },
    cart: [],
  });

  const hash = User.generateHash('force'); // req.body.password
  newUser.password = hash;

  User.saveUser(newUser)
    .then(function callback(userSaved) {
      debug('userSaved : ', userSaved);
      res.send(userSaved);
    }, function error(err) {
      debug('error : ', err);
      res.send(err);
    });
}

function login(req, res) {
  res.render('login');
}

function logout(req, res) {
  req.logout();
  res.redirect('/');
}

router.route('/signup')
  .post(createUser);

router.route('/login')
  .get(login);

router.route('/logout')
  .get(logout);
