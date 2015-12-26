const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstname: { type: String, trim: true, required: true},
  lastname: { type: String, trim: true, required: true},
  password: { type: String, trim: true, required: true},
  email: {type: String, trim: true, required: true},
  admin: Boolean,
  address: {
    street: {type: String, trim: true},
    zip: {type: String, trim: true},
    city: {type: String, trim: true},
    state: {type: String, trim: true},
  },
  cart: [{type: ObjectId, ref: 'Product'}],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
