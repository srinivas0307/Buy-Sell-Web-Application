# Buy, Sell @ IIITH

## Project Overview
This project is a Buy-Sell platform exclusively designed for the IIIT community. Built using the MERN stack (MongoDB, Express.js, React, and Node.js), it enables users to act as both buyers and sellers, facilitating seamless transactions within the IIIT ecosystem.


## Tech Stack
- **Frontend:** React, Vite
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JWT, bcrypt.js
- **Additional Tools:** Google ReCaptcha/LibreCaptcha, AI ChatBot (optional)

##  Features
### **Authentication & User Management**
- User Registration (**Only IIIT email allowed**)
- Secure login with JWT authentication
- Users remain logged in unless they log out
- Password hashing using **bcrypt.js**
- Google reCAPTCHA/LibreCaptcha support
- Page Redirections using cookies

### **Profile Page**
- User can edit his basic details like Name,Age,contact number
- Change Password Option
- User Reviews from Previous Buyers are also displayed and there is a option to clear the reviews

###  **Item Management**
- Users can add items to sell in the website under different **categories**
- Buyers can search and filter items
- Each Item with unique page and Item details page has seller information
- Add-to-cart option to add item to user Cart
- If an item is already present then the quantity if increased and the user is notified about the increment of the quantity
- User can't add his own items to cart(infact user can't see his own products in the buy page)


###  **Orders & Transactions**
- Users can track **bought and sold items**
- Users can also see **pending**
- Regenerate OTP option for pending orders
- Sellers see a **"Deliver Items"** page with **OTP-based order confirmation**

###  **Reviews & Ratings**
- Buyers can leave reviews for sellers once a order is confirmed by Seller.
- Buyer can give the review only once 

###  **Shopping Cart**
- Items can be added or removed from the cart
- Displays total cost
- **Final Order button** for checkout
- Displays OTP after placing succesful order.
- Successful orders reflect in the **Deliver Items** and **Orders History** pages

###  **Chatbot Support**
- AI chatbot (Gemini) for answering user queries
- Chat UI with **session-based** responses

---

## Installation Guide
###  **Download the Zip**
```sh
   Download the Zip file and Extract it.
```

### **Front-End Setup**

```sh 
   npx create-vite@latest

   npm install axios buffer react react-dom react-google-recaptcha react-markdown react-router-dom

    npm run dev

```

### **Back-End Setup**

```sh
   npm init -y

   npm install @google/generative-ai axios bcrypt bcryptjs  cors 

   npm dotenv express jsonwebtoken mongoose mongodb nodemon

   npm run start

```   

## Features
- **User Authentication:** Secure login and registration with hashed passwords.
- **Profile Management:** Edit user details.
- **Item Search & Filter:** Search for items with filters based on categories.
- **Cart Management:** Add, view, and remove items from the cart.
- **Order History:** Track pending, bought, and sold orders.
- **Seller Dashboard:** Manage orders and verify transactions with OTP.
- **Automated ChatBot:** AI-powered support system (Bonus Feature).

## Deliverables
- `backend/` and `frontend/` directories with all necessary files (excluding `node_modules`).
- Correct `package.json` files.
- README.md with project documentation.


