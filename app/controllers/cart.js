const debug = require('debug')('estarwars:controllers:cart');
const express = require('express');
const router = module.exports = new express.Router();
const User = require('../models/user');
// const Product = require('../models/product');

// function showCart(req, res) {
//   const userId = req.params.id;
//   if (userId) {
//     User.retrieveCart(userId)
//     .then(function callback(products) {
//       res.render('cart', {user: req.user, products: products});
//     }, function error(err) {
//       debug('error : ', err);
//     });
//   } else {
//     // get localstorage products
//   }
// }

function showUserCart(req, res) {
  if (req.user) {
    const userId = req.user._id;
    User.retrieveCart(userId)
    .then(function callback(userInfos) {
      res.render('cart', {user: req.user, cart: userInfos.cart, url: '/cart'});
    }, function error(err) {
      debug('error : ', err);
    });
  } else {
    debug('no user connected');
    res.render('cart', {url: '/cart'});
  }
}


router.route('/cart')
.get(showUserCart);
