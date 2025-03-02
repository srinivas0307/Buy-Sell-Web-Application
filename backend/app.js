const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();
const PORT = process.env.port;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Placeholder Route
app.get('/', (req, res) => {
  res.send('Welcome to the Buy-Sell Website');
});

app.use('/api/users', require('./routes/userauth'));
app.use('/api/profile', require('./routes/profileroutes'));
app.use('/api/items',require('./routes/itemroutes'));
app.use('/api/cart',require('./routes/cartroutes'));
app.use('/api/orders',require('./routes/orderroutes'));
app.use('/api/sell',require('./routes/sellroutes'));
app.use('/api/chatbot',require('./routes/chatbotroute'));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


// const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');
// const userModel = require('./models/user');
// const jwt = require('jsonwebtoken');

// const JWT_SECRET = process.env.jwt_secret;
// const mongodburl = process.env.mongourl;

// // Connect to MongoDB
// mongoose.connect(mongodburl, {
  //   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// mongoose.connection.once('open', () => {
//   console.log('Connected to MongoDB');
// });

// const authenticateToken = (req, res, next) => {
//   const token = req.header('Authorization')?.split(' ')[1];
//   if (!token) return res.status(401).json({ message: 'Access denied, no token provided' });

//   jwt.verify(token, JWT_SECRET, (err, user) => {
//     if (err) return res.status(403).json({ message: 'Invalid token' });
//     req.user = user;
//     next();
//   });
// };



// login route
// app.post('/api/users/login',async(req,res)=>{
//   const {email,password} = req.body;
//   console.log(req.body);
//   try{
//     const user= await userModel.findOne({email});
//     console.log(user);
//     if(user){
//       const isPasswordMatch = await bcrypt.compare(password,user.password);
//       if(!isPasswordMatch) {
//         res.status(400).json({message: 'Password does not match. Please try again.'});
//         return;
//       }
//       const token=jwt.sign({email:user.email,id:user._id},JWT_SECRET);
//       res.status(200).json({message: 'Login Successful',user:token});
//     }
//     else{
//       res.status(400).json({message: 'Invalid Credentials. Please try again.'});
//     }
//   } catch(error){
//     console.error(error);
//     res.status(500).json({message: 'Login Failed. Please try again.'});
//   }
// });

// // signup route
// app.post('/api/users/signup',async(req,res)=>{
//   console.log(req.body);
//   const {firstName,lastName,email,age,contact,password} = req.body;
//   try{
//     const exituser = await userModel.findOne({email});
//     if(exituser){
//       res.status(500).json({message: 'User already exists. Please try again.'});
//       return;
//     }
//     const hasedPassword = await bcrypt.hash(password,10);
//     const newUser = await userModel.create({firstName,lastName,email,age,contact,password:hasedPassword,itemsInCart: [],sellerReviews: []});
//     const token=jwt.sign({email: newUser.email, id: newUser._id},JWT_SECRET,{expiresIn:'1h'});
//     res.status(200).json({message: 'Signup Successful',user:token});
//   }
//   catch(error){
//     console.error(error);
//     res.status(500).json({message: 'Error signing up. Please try again.'});
//   }

// });

// // profile route
// app.get('/api/users/profile', authenticateToken, async (req, res) => {
//   try {
//     const user = await userModel.findOne({ email: req.user.email });

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     res.status(200).json({
//       firstName: user.firstName,
//       lastName: user.lastName,
//       email: user.email,
//       age: user.age,
//       contact: user.contact,
//       itemsInCart: user.itemsInCart,
//       sellerReviews: user.sellerReviews
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Error fetching user data' });
//   }
// });

// update profile route
// app.put('/api/users/profile',authenticateToken,async(req,res)=>{
//   const {firstName,lastName,email,age,contact} =req.body;
//   try{
//     const userId=req.user.id;
//     const updateddata=req.body;
//     const user= await userModel.findByIdAndUpdate(userId,updateddata,{new:true});
//     if(!user){
//       return res.status(404).json({message: 'User not found'});
//     }
//     return res.status(200).json(user);
//   }catch(error){
//     console.error(error);
//     res.status(500).json({message: 'Error updating user data'});
//   }
// })

// Start the Server
