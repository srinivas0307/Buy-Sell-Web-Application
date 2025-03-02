const express = require('express');
const router = express.Router();
const userModel = require('../models/user');
const authenticateToken = require('../middleware/authenticate');
const itemModel = require('../models/items');
const orderModel = require('../models/orders');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.jwt_secret;
router.use(express.json());

//add order route
router.post('/place',authenticateToken, async(req,res)=>{
    try{
        console.log('add order route\n');
        const userId=req.userId;
        const user=await userModel.findById(userId);
        let orderIds=[];
        if(!user){
            return res.status(404).json({message:'User not found'});
        }
        const {cartItems}=req.body;
        for(const item of cartItems){
            const items=await itemModel.findById(item.itemId);
            if(!items){
                return res.status(404).json({message:'Item not found'});
            }
            const transactionId = Math.floor(100000 + Math.random() * 900000);
            const order=new orderModel({
                transactionid:transactionId,
                itemName:items.name,
                price:items.price,
                buyer:user.firstName+' '+user.lastName,
                buyerid:user._id,
                seller:items.sellername,
                sellerid:items.sellerid,
                quantity:item.quantity,
                status:'pending',

            })
            orderIds.push(order._id);
            await order.save();
        }
        user.itemsInCart=[];
        await user.save();
        res.status(201).json({message:'Order placed',success:true,orderIds});
    }
    catch(error){
        console.error(error);
        res.status(500).json({message:'Error placing order'});
    }
});

// generate otp route
router.post('/generateotp', authenticateToken, async (req, res) => {
    try {
        console.log('generate otp route\n');
        const { orderId } = req.body;
        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        console.log(order);
        const otp = Math.floor(1000 + Math.random() * 9000);
        const hashedOtp = await bcrypt.hash(otp.toString(), 10);
        order.otp = hashedOtp;
        await order.save();
        console.log('otp generated');
        res.status(200).json({ message: 'OTP generated', otp,sucess:true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error generating OTP' });
    }
});

//get all the pending orders
router.get('/pending',authenticateToken, async(req,res)=>{
    try{
        console.log('get all pending orders\n');
        const userId=req.userId;
        const user=await userModel.findById(userId);
        if(!user){
            return res.status(404).json({message:'User not found'});
        }
        const orders=await orderModel.find({buyerid:userId,status:'pending'});
        console.log(orders);
        res.status(200).json(orders);
    }
    catch(error){
        console.error(error);
        res.status(500).json({message:'Error fetching orders'});
    }
});

//get all the completed orders
router.get('/completed',authenticateToken, async(req,res)=>{
    try{
        console.log('get all completed orders\n');
        const userId=req.userId;
        const user=await userModel.findById(userId);
        if(!user){
            return res.status(404).json({message:'User not found'});
        }
        const orders=await orderModel.find({buyerid:userId,status:'completed'});
        console.log(orders);
        res.status(200).json(orders);
    }
    catch(error){
        console.error(error);
        res.status(500).json({message:'Error fetching orders'});
    }
});

//get all the sold orders
router.get('/sold',authenticateToken, async(req,res)=>{
    try{
        console.log('get all orders sold by user\n');
        const userId=req.userId;
        const user=await userModel.findById(userId);
        if(!user){
            return res.status(404).json({message:'User not found'});
        }
        const orders=await orderModel.find({sellerid:userId,status:'completed'});
        console.log(orders);
        res.status(200).json(orders);
    }
    catch(error){
        console.error(error);
        res.status(500).json({message:'Error fetching orders'});
    }
});

//handle buyer review on seller route
router.post('/review',authenticateToken, async(req,res)=>{
    try{
        console.log('add review route\n');
        const userId=req.userId;
        const user=await userModel.findById(userId);
        if(!user){
            return res.status(404).json({message:'User not found'});
        }
        const {sellerId,review,itemid}=req.body;
        const order=await orderModel.findById(itemid);
        if(!order){
            return res.status(404).json({message:'Order not found'});
        }
        if(order.buyerid.toString()!==userId){
            return res.status(401).json({message:'You are not authorized to review this order'});
        }
        const seller=await userModel.findById(sellerId);
        console.log(seller);
        if(!seller){
            return res.status(404).json({message:'Seller not found'});
        }

        seller.sellerReviews.push({buyername:user.firstName+' '+user.lastName,review,itemname:order.itemName});
        await seller.save();

        if(order.reviewed){
            return res.status(400).json({message:'You have already reviewed this order'});
        }
        order.reviewed=true;
        await order.save();
        res.status(201).json({message:'Review added',success:true});
    }
    catch(error){
        console.error(error);
        res.status(500).json({message:'Error adding review'});
    }
});


module.exports = router;