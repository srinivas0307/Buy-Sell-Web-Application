const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user');
const authenticateToken = require('../middleware/authenticate');
const orderModel = require('../models/orders');

const JWT_SECRET = process.env.jwt_secret;

//get all orders sold by user
router.get('/sold', authenticateToken, async (req, res) => {
    try {
        console.log('get all orders sold by user\n');
        const userId = req.userId;
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        console.log(user);
        console.log(userId);
        const orders = await orderModel.find({ sellerid: userId ,status:'pending'});
        console.log(orders);
        res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching orders' });
    }
});

//verify otp route and complete order
router.post('/verifyotp', authenticateToken, async (req, res) => {
    try {
        console.log('verify otp route\n');
        const { orderId, enteredOTP } = req.body;
        const order = await orderModel.findById(orderId);
        if (!order) {
            console.log('Order not found');
            return res.status(404).json({ message: 'Order not found' });
        }
        if (order.status === 'completed') {
            console.log('Order already completed');
            return res.status(400).json({ message: 'Order already completed' });
        }
        if (order.status === 'pending') {
            //otp is hashed and stored in db
            const isOtpMatch = bcrypt.compare(enteredOTP, order.otp);
            if (!isOtpMatch) {
                console.log('Invalid OTP');
                return res.status(400).json({ message: 'Invalid OTP' });
            }
            order.status = 'completed';
            await order.save();
            return res.status(200).json({ message: 'Order completed', success: true });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error verifying OTP' });
    }
});

module.exports = router;