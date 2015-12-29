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

productSchema.statics.modifyProduct = function modifyProduct(productId, productUpdatedInfos) {
  return this
    .findByIdAndUpdate(productId, productUpdatedInfos, {new: true})
    .exec();
};

productSchema.statics.retrieveProducts = function retrieveProducts(category) {
  const query = {published: true};

  if (category) {
    query.category = category;
  }

  return this
    .find(query)
    .sort({created_at: -1})
    .limit(process.env.LIMIT_PRODUCTS)
    .exec();
};

module.exports = mongoose.model('Product', productSchema);
