const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  title: { type: String, trim: true, required: true},
  content: { type: String, trim: true, required: true},
  photo: {type: String, trim: true},
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

productSchema.statics.removeProduct = function removeProduct(productId) {
  return this
    .findByIdAndRemove(productId)
    .exec();
};

productSchema.statics.retrieveProducts = function retrieveProducts(category, tag) {
  const query = {published: true};

  if (category) {
    query.category = category;
  }

  if (tag) {
    query.tags = { $in: [tag] };
  }

  return this
    .find(query)
    .sort({created_at: -1})
    .limit(process.env.LIMIT_PRODUCTS)
    .exec();
};

productSchema.statics.getAllProducts = function getAllProducts() {
  return this
    .find()
    .sort({created_at: -1})
    .limit(process.env.LIMIT_PRODUCTS * 2)
    .exec();
};

productSchema.statics.retrieveSingleProduct = function retrieveSingleProduct(productId) {
  return this
    .findById(productId)
    .exec();
};

module.exports = mongoose.model('Product', productSchema);
