const debug = require('debug')('estarwars:controllers:contact');
const express = require('express');
const router = module.exports = new express.Router();
const nodemailer = require('nodemailer');

// Allow to use a gmail adress from tier app : https://www.google.com/settings/security/lesssecureapps
const smtpTransport = nodemailer.createTransport('SMTP', {
  service: 'Gmail',
  auth: {
    user: process.env.MAIL_ENGINE_USER,
    pass: process.env.MAIL_ENGINE_PASSWORD,
  },
});

function contact(req, res) {
  res.render('contact', {user: req.user});
}

function sendMail(req, res) {
  const mailOptions = {
    from: (req.body.from + ' <maytheforce@bewith.you>'),
    to: process.env.LIST_MAILS_ORDER,
    subject: req.body.subject,
    text: ('message reçu de la part de ' + req.body.email + ' : \n\n' + req.body.content),
  };
  debug(mailOptions);

  smtpTransport.sendMail(mailOptions, function callback(error, response) {
    if (error) {
      debug(error);
      res.end('error');
    } else {
      debug('Message sent: ' + response.message);
      res.render('mail-sent');
    }
  });
}

router.route('/contact')
  .get(contact);

router.route('/api/sendmail')
  .post(sendMail);
