const mongoose = require('mongoose');

const orders = new mongoose.Schema({
    transactionid: { type: String, required: true },
    itemName: { type: String, required: true },
    price: { type: Number, required: true },
    buyer: { type: String, required: true }, 
    buyerid: { type: String, required: true },
    seller: { type: String, required: true },
    sellerid: { type: String, required: true }, 
    quantity: { type: Number,required: true },
    status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
    reviewed: { type: Boolean, default: false },
    otp: { type: String }, 
    date: { type: Date, default: Date.now }
});

const orderModel=mongoose.model('orders',orders);

module.exports=orderModel;