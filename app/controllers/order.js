const debug = require('debug')('estarwars:controllers:order');
const express = require('express');
const router = module.exports = new express.Router();
const Order = require('../models/order');
const User = require('../models/user');

function registerOrder(req, res) {
  const userId = req.user._id;

  User.retrieveCart(userId)
  .then(function callback(userInfos) { // userInfos.cart
    debug('userInfos : ', userInfos.cart);
    const cart = userInfos.cart;
    var total = 0;  // eslint-disable-line
    var productId = [];  // eslint-disable-line
    cart.forEach(function cb(product) {
      total += product.price;
      productId.push(product._id);
    });

    const newOrder = new Order({
      created_at: Date.now(),
      client: userId,
      products: productId,
      total: total,
      finalized: true,
    });
    Order.registerOrder(newOrder)
    .then(function cb(orderSaved) {
      debug('orderSaved : ', orderSaved);
      res.render('confirm', {order: orderSaved, user: req.user});
    }, function error(err) {
      debug('error : ', err);
    });
  }, function error(err) {
    debug('error : ', err);
  });
}

function displayOrders(req, res) {
  Order.displayOrders()
  .then(function callback(orders) {
    res.send(orders);
  }, function error(err) {
    debug('error : ', err);
  });
}

router.route('/confirm')
.post(registerOrder);

router.route('/api/orders')
  .get(displayOrders);
