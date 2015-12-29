const debug = require('debug')('estarwars:controllers:product');
const express = require('express');
const router = module.exports = new express.Router();
const Product = require('../models/product');


function createProduct(req, res) {
  const starWarsProduct = new Product({
    title: 'lukes Saber',
    content: 'The most popular jedi saber',
    created_at: Date.now(),
    published: false,
    quantity: 30,
    price: 499,
    category: 'laser',
    tags: ['jedi', 'alliance'],
  });

  Product.saveProduct(starWarsProduct)
    .then(function callback(productSaved) {
      debug('productSaved : ', productSaved);
      res.send(productSaved);
    });
}

function updateProduct(req, res) {
  const productId = '568161139668aa6a35dc5c10'; // req.params.id
  const productUpdatedInfos = {'category': 'cap', 'price': 349}; // req.body

  Product.modifyProduct(productId, productUpdatedInfos)
    .then(function callback(productUpdated) {
      debug('productUpdated : ', productUpdated);
      res.send(productUpdated);
    }, function error(err) {
      debug('error : ', err);
    });
}

// ## Routing table
router.route('/products')
  .post(createProduct);

router.route('/products/:id')
  .put(updateProduct);
