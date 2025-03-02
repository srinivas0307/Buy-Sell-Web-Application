// mongodb users collection
const mongoose = require('mongoose');

const user = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number, required: true },
    contact: { type: String, required: true },
    password: { type: String, required: true },
    itemsInCart: { type: [{ itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' }, name: String, price: Number, quantity: { type: Number, default: 1 } }], default: [] },
    sellerReviews: { type: [{ buyername: { type: String, required: true }, review: { type: String, required: true },itemname:{type:String ,required:true }, createdat: { type: Date, default: Date.now }, }], default: [] },
});

const userModel = mongoose.model('users', user);

module.exports = userModel;
