const express = require('express');
const router = module.exports = new express.Router();
// const sanitizeHtml = require('sanitize-html');


router.get('/', function root(req, res) {
  return res.render('home', {hello: 'Hello world !'});
});
