const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  title: { type: String, trim: true, required: true},
  content: { type: String, trim: true, required: true},
  photo: {data: Buffer, contentType: String, url: String},
  photoSmall: {data: Buffer, contentType: String, url: String},
  created_at: {type: Date, default: Date.now},
  published: Boolean,
  quantity: {type: Number, trim: true},
  price: {type: Number, trim: true},
  category: {type: String, trim: true},
  tags: [{type: String, trim: true}],
});

productSchema.statics.saveProduct = function saveProduct(product) {
  return this.create(product);
};

module.exports = mongoose.model('Product', productSchema);
