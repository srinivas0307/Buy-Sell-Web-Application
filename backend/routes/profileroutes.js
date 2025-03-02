const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user');
const authenticateToken = require('../middleware/authenticate');

const JWT_SECRET = process.env.jwt_secret;

// profile route
router.get('/data', authenticateToken, async (req, res) => {
    try {
        const email = req.email;
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        console.log('found the user\n');
        console.log(user);

        res.status(200).json({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            age: user.age,
            contact: user.contact,
            itemsInCart: user.itemsInCart,
            sellerReviews: user.sellerReviews
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching user data' });
    }
});

//profile update route
router.put('/update', authenticateToken, async (req, res) => {
    const { firstName, lastName, email, age, contact } = req.body;
    try {
        const userId = req.userId;
        const updateddata = req.body;
        const user = await userModel.findByIdAndUpdate(userId, updateddata, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating user data' });
    }
})

//change password route
router.post('/change-password', authenticateToken, async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    try {
        const userId = req.userId;
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordMatch) {
            res.status(500).json({ message: 'Password does not match. Please try again.' });
            return;
        }
        const hasedPassword = await bcrypt.hash(newPassword, 10);
        const updatedUser = await userModel.findByIdAndUpdate(userId, { password: hasedPassword }, { new: true });
        return res.status(200).json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating user data' });
    }
})

//clear reviews route
router.put('/clear-reviews', authenticateToken, async (req, res) => {
    try {
        const userId = req.userId;
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.sellerReviews = [];
        await user.save();
        return res.status(200).json({ message: 'Reviews cleared' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error clearing reviews' });
    }
});

module.exports = router;