const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const userSchema = new Schema({
  firstname: { type: String, trim: true, required: true},
  lastname: { type: String, trim: true, required: true},
  email: {type: String, trim: true, unique: true, required: true},
  password: { type: String, trim: true, required: true},
  admin: Boolean,
  address: {
    street: {type: String, trim: true},
    zip: {type: String, trim: true},
    city: {type: String, trim: true},
    state: {type: String, trim: true},
  },
  cart: [{type: ObjectId, ref: 'Product'}],
});

userSchema.statics.saveUser = function saveUser(newUser) {
  return this.create(newUser);
};

// generating a hash
userSchema.statics.generateHash = function generateHash(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function validPassword(password) {
  return bcrypt.compareSync(password, this.password);
};

userSchema.statics.retrieveCart = function retrieveCart(userId) {
  return this
    .findById(userId, 'cart')
    .populate('cart')
    .exec();
};

userSchema.statics.addToCart = function addToCart(userId, productId) {
  return this
    .findByIdAndUpdate(userId, {$addToSet: {'cart': productId}}, {new: true})
    .populate('cart')
    .exec();
};

userSchema.statics.removeFromCart = function removeFromCart(userId, productId) {
  return this
    .findByIdAndUpdate(userId, {$pull: {'cart': productId}}, {new: true})
    .populate('cart')
    .exec();
};

module.exports = mongoose.model('User', userSchema);
