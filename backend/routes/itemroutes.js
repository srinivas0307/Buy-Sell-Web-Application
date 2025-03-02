const express = require('express');
const router = express.Router();
const itemModel = require('../models/items');
const userModel = require('../models/user');
const authenticateToken = require('../middleware/authenticate');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.jwt_secret;

//add item route
router.post('/add', authenticateToken, async (req, res) => {
    console.log('add item route\n' + req.body);
    const { name, price, category, description } = req.body;
    const sellerid = req.userId;
    const sellername = req.name;
    try {
        const item = await itemModel.create({ name, price, category, description, sellername, sellerid });
        res.status(201).json(item);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding item' });
    }
});

//get items route
router.get('/get', authenticateToken, async (req, res) => {
    try {
        const userId = req.userId;
        console.log(userId);

        const items = await itemModel.find({ sellerid: { $ne: userId } });
        console.log(items);

        res.status(200).json(items);
    } catch (err) {
        console.error('Error fetching items:', err);
        res.status(500).json({ message: 'Failed to fetch items. Please try again later.' });
    }
});

//get items by id route
router.get('/get/id/:id', authenticateToken, async (req, res) => {
    console.log('get item by id route\n');
    const { id } = req.params;
    try {
        const item = await itemModel.findById(id);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.status(200).json(item);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching item' });
    }
});


module.exports = router;