import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MyCart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [totalCost, setTotalCost] = useState(0);

    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            alert('You are not authenticated. Please log in.');
            return;
        }

        axios.get('http://localhost:5000/api/cart/get', {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(response => {
                setCartItems(response.data);
                calculateTotal(response.data);
            })
            .catch(error => console.error('Error removing item:', error.response?.data?.message));

    }, [token]);

    const calculateTotal = (items) => {
        const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        setTotalCost(total);
    };

    const removeItem = (itemId) => {
        axios.delete(`http://localhost:5000/api/cart/remove/${itemId}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(() => {
                const updatedCart = cartItems.filter(item => item.id !== itemId);
                setCartItems(updatedCart);
                calculateTotal(updatedCart);
            })
            .catch(error => console.error('Error removing item:', error.response?.data?.message));
        
        window.location.reload();
    };

    const placeOrder = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/orders/place', { cartItems }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.status === 201) {
                alert('Order placed successfully!');

                let alertMessages = [];
                let orderIds = response.data.orderIds;

                for (const item of cartItems) {
                    try {
                        const otpResponse = await axios.post('http://localhost:5000/api/orders/generateotp', {
                            orderId: orderIds.shift(),
                        }, {
                            headers: { Authorization: `Bearer ${token}` },
                        });

                        alertMessages.push(`OTP for the item: ${item.name} is ${otpResponse.data.otp}`);
                    } catch (otpError) {
                        console.error('Error generating OTP for', item.name, otpError);
                    }
                }

                alert('OTP generated successfully!\n' + alertMessages.join('\n'));
                setCartItems([]);
                setTotalCost(0);
            } else {
                alert('Order placement failed. Try again.');
            }
        } catch (error) {
            console.error('Error placing order:', error);
        }
    };


    const clearCart = () => {
        axios.delete('http://localhost:5000/api/cart/clear', {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(() => {
                setCartItems([]);
                setTotalCost(0);
            })
            .catch(error => console.error('Error clearing cart:', error));
    };

    if (!token) {
        return <p>You are not authenticated. Please log in.</p>;
    }

    return (
        <div className="page">
            <h1>My Cart</h1>
            {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <div>
                    <div className="cart-container">
                        {cartItems.map(item => (
                            <div key={item.itemId || item._id}>
                                <div className="item-card">
                                    <h4 className="item-title">{item.name}</h4>
                                    <p>Price: Rs.{item.price}</p>
                                    <p>Quantity: {item.quantity}</p>
                                    <button onClick={() => removeItem(item.itemId || item._id)}>Remove</button>
                                </div>
                            </div>
                        ))}

                    </div>
                    <h3>Total Cost: Rs.{totalCost}</h3>
                    <button onClick={placeOrder} className="final-order-button">
                        Final Order
                    </button>
                    <button onClick={clearCart} className="final-order-button">
                        Clear Cart
                    </button>
                </div>
            )}
        </div>
    );
};

export default MyCart;
