const debug = require('debug')('estarwars:controllers:cart');
const express = require('express');
const router = module.exports = new express.Router();
const User = require('../models/user');

function showUserCart(req, res) {
  if (req.user) {
    const userId = req.user._id;
    const routePath = req.route.path;
    User.retrieveCart(userId)
    .then(function callback(userInfos) {
      if (routePath === '/buy') {
        return res.render('buy', {user: req.user, cart: userInfos.cart});
      }
      res.render('cart', {user: req.user, cart: userInfos.cart});
    }, function error(err) {
      debug('error : ', err);
    });
  } else {
    debug('no user connected');
    res.render('cart');
  }
}

function addToCart(req, res) {
  if (req.user) {
    const userId = req.user._id;
    const productId = req.params.id;
    const productQuantity = req.body.quantity;
    User.addToCart(userId, productId, productQuantity)
    .then(function callback(userInfos) {
      debug('userInfos.cart : ', userInfos.cart);
      res.render('cart', {user: req.user, cart: userInfos.cart});
    }, function error(err) {
      debug('error : ', err);
    });
  } else {
    debug('no user connected');
    res.render('cart');
  }
}

function removeFromCart(req, res) {
  if (req.user) {
    const userId = req.user._id;
    const productId = req.params.id;
    User.removeFromCart(userId, productId)
    .then(function callback(userInfos) {
      debug('userInfos.cart : ', userInfos.cart);
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

router.route('/api/cart/add/:id')
.put(addToCart);

router.route('/api/cart/remove/:id')
.put(removeFromCart);

router.route('/buy')
.get(showUserCart);
