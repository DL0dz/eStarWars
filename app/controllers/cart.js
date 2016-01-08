const debug = require('debug')('estarwars:controllers:cart');
const express = require('express');
const router = module.exports = new express.Router();
const User = require('../models/user');

function showUserCart(req, res) {
  if (req.user) {
    const userId = req.user._id;
    User.retrieveCart(userId)
    .then(function callback(userInfos) {
      res.render('cart', {user: req.user, cart: userInfos.cart});
    }, function error(err) {
      debug('error : ', err);
    });
  } else {
    debug('no user connected');
    res.render('cart');
  }
}


router.route('/cart')
.get(showUserCart);
