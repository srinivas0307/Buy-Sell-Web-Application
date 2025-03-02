const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const userModel = require('../models/user');

const JWT_SECRET = process.env.jwt_secret;

// signup route
router.post('/signup', async (req, res) => {
  console.log(req.body);
  const { firstName, lastName, email, age, contact, password } = req.body;
  try {
    const exituser = await userModel.findOne({ email });
    if (exituser) {
      res.status(500).json({ message: 'User already exists. Please try again.' });
      return;
    }
    const hasedPassword = await bcrypt.hash(password, 10);
    const newUser = await userModel.create({ firstName, lastName, email, age, contact, password: hasedPassword, itemsInCart: [], sellerReviews: [] });
    const token = jwt.sign({ name: (newUser.firstName + newUser.lastName), email: newUser.email, id: newUser._id }, JWT_SECRET);
    res.status(200).json({ message: 'Signup Successful', user: token });
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error signing up. Please try again.' });
  }

});

// login route
router.post('/login', async (req, res) => {
  const { email, password, recaptchaToken } = req.body;
  console.log(req.body);
  const secret_key=process.env.captcha_secret;
  try {
    const captchares = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${recaptchaToken}`);
    if (!captchares.data.success) {
      res.status(500).json({ message: 'Failed reCAPTCHA verification. Please try again.' });
      return;
    }
    const user = await userModel.findOne({ email });
    console.log(user);
    if (user) {
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        res.status(500).json({ message: 'Password does not match. Please try again.' });
        return;
      }
      const token = jwt.sign({ name: (user.firstName + user.lastName), email: user.email, id: user._id }, JWT_SECRET);
      res.status(200).json({ message: 'Login Successful', user: token });
    }
    else {
      res.status(500).json({ message: 'Account not found . Please sign up!' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Login Failed. Please try again.' });
  }
});

module.exports = router;