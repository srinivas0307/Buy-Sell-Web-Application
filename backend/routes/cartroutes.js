const express = require('express');
const router = express.Router();
const userModel = require('../models/user');
const authenticateToken = require('../middleware/authenticate');

// get cart items route
router.get('/get', authenticateToken, async (req, res) => {
    try {
        console.log('get cart items route\n');
        const userId = req.userId;
        const user = await userModel.findById(userId);
        if(!user){
            return res.status(404).json({ message: 'User not found' });
        }
        console.log(user);
        const cartItems = user.itemsInCart;
        console.log(cartItems);
        console.log('cart items fetched');
        res.status(200).json(cartItems);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching cart items' });
    }
});

// add item to cart route
router.post('/add', authenticateToken, async (req, res) => {
    const { itemId, name, price } = req.body;

    try {
        const userId = req.userId; 
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const existingItem = user.itemsInCart.find(item => item.itemId.toString() === itemId);

        if (existingItem) {
            existingItem.quantity += 1;
            await user.save();
            return res.status(200).json({ message: 'Item quantity increased'});
        } else {
            user.itemsInCart.push({ itemId, name, price, quantity: 1 });
        }

        await user.save();

        res.status(200).json({ message: 'Item added to cart'});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding item to cart' });
    }
});


// remove item from cart route
router.delete('/remove/:itemId', authenticateToken, async (req, res) => {
    const { itemId } = req.params;

    try {
        const userId = req.userId;
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        console.log(user);

        const itemIndex = user.itemsInCart.findIndex(item => item.itemId.toString() === itemId);

        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Item not in cart' });
        }

        user.itemsInCart.splice(itemIndex, 1);
        await user.save();

        res.status(200).json({ message: 'Item removed from cart' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error removing item from cart' });
    }
});


// clear cart route
router.delete('/clear', authenticateToken, async (req, res) => {
    try {
        const userId = req.userId;
        const user = await userModel.findById(userId);
        if(!user){
            return res.status(404).json({ message: 'User not found' });
        }
        console.log(user);
        user.itemsInCart = [];
        await user.save();
        res.status(200).json({ message: 'Cart cleared' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error clearing cart' });
    }
}
);
exports = module.exports = router;
