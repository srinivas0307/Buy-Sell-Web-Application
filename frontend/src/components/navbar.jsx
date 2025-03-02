import React from 'react';
import {Link,useNavigate} from 'react-router-dom';
// import './navbar.css';

const Navbar = () => {
    const navigate=useNavigate();
    const handleLogout=()=>{
        localStorage.removeItem('token');
        navigate('/home');
        window.location.reload();
    }
    return (
        <nav>
            <ul>
                {/* <li><Link to="/">Home</Link></li> */}
                {/* <li><Link to="/login">Login</Link></li>
                <li><Link to="/signup">Signup</Link></li> */}
                <li><Link to="/profile">Profile</Link></li>
                <li><Link to ="/buy">Buy Items</Link></li>
                <li><Link to ="/additem">Add Item</Link></li>
                <li><Link to ="/mycart">My Cart</Link></li>
                <li><Link to ="/orderhistory">Order History</Link></li>
                <li><Link to ="/sellerorders">Deliver Page</Link></li>
                <li><Link to ="/chatbot">Chatbot</Link></li>
                <li><button onClick={handleLogout}>Logout</button></li>
            </ul>
        </nav>
    );
};

export default Navbar;