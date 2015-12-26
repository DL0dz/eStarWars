const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  created_at: {type: Date, default: Date.now},
  client: {type: ObjectId, ref: 'User'},
  products: [{type: ObjectId, ref: 'Product'}],
  total: {type: Number, trim: true},
  finalized: Boolean,
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
