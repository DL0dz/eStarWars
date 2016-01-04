const debug = require('debug')('estarwars:controllers:user');
const express = require('express');
const router = module.exports = new express.Router();
const User = require('../models/user');

function createUser(req, res) {
  const newUser = new User({
    firstname: 'Jean',
    lastname: 'Jeannot',
    email: 'jean@jeannot.com',
    admin: false,
    address: {
      street: '6 rue Souchal',
      zip: '92110',
      city: 'Clichy',
      state: 'France',
    },
    cart: [null],
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
