const debug = require('debug')('estarwars:controllers:product');
const express = require('express');
const router = module.exports = new express.Router();
const Product = require('../models/product');


function createProduct(req, res) {
  const starWarsProduct = new Product({
    title: 'lukes Saber', // req.body.title
    content: 'The most popular jedi saber', // req.body.content
    created_at: Date.now(),
    published: false, // req.body.published
    quantity: 30, // req.body.quantity
    price: 499, // req.body.price
    category: 'laser', // req.body.category
    tags: ['jedi', 'alliance'], // req.body.tags
  });

  Product.saveProduct(starWarsProduct)
    .then(function callback(productSaved) {
      debug('productSaved : ', productSaved);
      res.send(productSaved);
    }, function error(err) {
      debug('error : ', err);
    });
}

function updateProduct(req, res) {
  const productId = '568161139668aa6a35dc5c10'; // req.params.id
  const productUpdatedInfos = {'category': 'cap', 'price': 349}; // req.body
  debug('req.route :  : ', req.route.path);

  Product.modifyProduct(productId, productUpdatedInfos)
    .then(function callback(productUpdated) {
      debug('productUpdated : ', productUpdated);
      res.send(productUpdated);
    }, function error(err) {
      debug('error : ', err);
    });
}

// ## Routing table
router.route('/api/products')
  .post(createProduct);

router.route('/api/products/:id')
  .put(updateProduct);
