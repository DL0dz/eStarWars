const debug = require('debug')('estarwars:controllers:user');
const express = require('express');
const router = module.exports = new express.Router();
const User = require('../models/user');

function createUser(req, res) {
  const newUser = new User({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    admin: false,
    address: {
      street: req.body.street,
      zip: req.body.zip,
      city: req.body.city,
      state: req.body.state,
    },
    cart: [],
  });

  const hash = User.generateHash(req.body.password);
  newUser.password = hash;

  User.saveUser(newUser)
    .then(function callback(userSaved) {
      debug('userSaved : ', userSaved);
      res.render('login', {userSaved: userSaved, userCreated: true});
    }, function error(err) {
      debug('error : ', err);
      res.send(err);
    });
}

function signup(req, res) {
  res.render('signup');
}

function login(req, res) {
  res.render('login');
}

function logout(req, res) {
  req.logout();
  res.redirect('/');
}

router.route('/signup')
  .get(signup)
  .post(createUser);

router.route('/login')
  .get(login);

router.route('/logout')
  .get(logout);
