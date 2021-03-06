const debug = require('debug')('estarwars:controllers:product');
const express = require('express');
const router = module.exports = new express.Router();
const Product = require('../models/product');
const categories = ['', 'lasers', 'helmets'];
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function destination(req, file, callback) {
    callback(null, './app/assets/products/');
  },
  filename: function filename(req, file, cb) {
    crypto.pseudoRandomBytes(16, function callback(err, raw) {
      if (err) return cb(err);
      cb(null, raw.toString('hex') + Date.now() + path.extname(file.originalname));
    });
  },
});
const upload = multer({ storage: storage}).single('productPhoto');


function showProducts(req, res) {
  const routePath = req.route.path;
  const category = routePath.slice(1, routePath.length);
  const tag = req.query.tag;

  Product.retrieveProducts(category, tag)
    .then(function callback(products) {
      res.render('home', {products: products, category: category, tag: tag, user: req.user});
    }, function error(err) {
      debug('error : ', err);
    });
}

function dashboardProducts(req, res) {
  Product.getAllProducts()
    .then(function callback(products) {
      res.render('dashboard', {products: products, user: req.user});
    }, function error(err) {
      debug('error : ', err);
    });
}

function userStatus(req, res, next) {
  if (!req.user) {
    return res.redirect('/');
  }
  if (!req.user.admin) {
    return res.redirect('/');
  }
  next();
}

function addProduct(req, res) {
  if (req.user) {
    return res.render('add-product', {user: req.user});
  }
  res.redirect('/');
}

function createProduct(req, res) {
  const productAddedInfos = req.body;

  Product.saveProduct(productAddedInfos)
    .then(function callback(productAdded) {
      debug('productAdded : ', productAdded);
      res.send(productAdded);
    }, function error(err) {
      debug('error : ', err);
    });
}

function updateProduct(req, res) {
  const productId = req.params.id; // req.params.id
  const productUpdatedInfos = req.body; // req.body

  Product.modifyProduct(productId, productUpdatedInfos)
    .then(function callback(productUpdated) {
      debug('productUpdated : ', productUpdated);
      res.send(productUpdated);
    }, function error(err) {
      debug('error : ', err);
    });
}

function deleteProduct(req, res) {
  const productId = req.params.id;

  Product.removeProduct(productId)
    .then(function callback(productDeleted) {
      debug('productDeleted : ', productDeleted);
      res.send(productDeleted);
    }, function error(err) {
      debug('error : ', err);
    });
}

function singleProduct(req, res) {
  const productId = req.params.id;
  const mode = req.query.mode;

  Product.retrieveSingleProduct(productId)
    .then(function callback(product) {
      debug('product : ', product);

      if (req.user) {
        if (mode === 'edit' && req.user.admin) {
          return res.render('edit-product', {product: product, user: req.user});
        }
      }
      res.render('product', {product: product});
    }, function error(err) {
      debug('error : ', err);
    });
}

function uploadProductPhoto(req, res) {
  upload(req, res, function(err) {
    if (err) {
      debug('error : ', err);
      return res.end('Error uploading file.');
    }
    if (!req.file) {
      return res.redirect('/');
    }
    const productId = req.params.id;
    const filePath = req.file.path;
    const url = filePath.replace('app/assets', '');
    const productUpdatedInfos = {'photo': url};

    Product.modifyProduct(productId, productUpdatedInfos)
      .then(function callback(productUpdated) {
        debug('productUpdated : ', productUpdated);
        res.redirect('/dashboard');
      }, function error(erreur) {
        debug('error : ', erreur);
      });
  });
}

// ## Routing table
categories.forEach(function callback(category) {
  router.route('/' + category)
    .get(showProducts);
});

router.route('/dashboard')
  .get(userStatus, dashboardProducts);

router.route('/products/add')
  .get(addProduct);

router.route('/api/products')
  .post(createProduct);

router.route('/api/products/:id')
  .put(updateProduct)
  .delete(deleteProduct);

router.route('/products/:id')
  .get(singleProduct);

router.route('/api/photo/:id')
  .post(uploadProductPhoto); // TODO : change method to UPDATE with ajax
