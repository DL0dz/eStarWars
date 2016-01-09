const express = require('express');
const router = module.exports = new express.Router();

router.route('/mentions')
  .get(mentions);

function mentions(req, res) {
  res.render('mentions');
}