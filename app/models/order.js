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

orderSchema.statics.registerOrder = function registerOrder(order) {
  return this.create(order);
};

orderSchema.statics.displayOrders = function displayOrders() {
  return this
    .find()
    .sort({created_at: -1})
    .populate('products client')
    .exec();
};

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
