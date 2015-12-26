const mongoose = require('mongoose');
const debug = require('debug')('estarwars:mongo');

mongoose.connect(process.env.MONGODB_ADDON_URI || null, { autoIndex: false });

const db = mongoose.connection;
db.on('open', function cb() {
  debug('Connection established to mongodb estarwars !');
});
db.on('error', function cb() {
  debug('Cannot connect to mongodb Database estarwars :(');
  process.exit();
});

module.exports = function cb(onceReady) {
  if (onceReady) {
    db.on('open', onceReady);
  }
};
