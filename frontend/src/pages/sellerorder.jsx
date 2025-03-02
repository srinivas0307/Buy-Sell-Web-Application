import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DeliverItems = () => {
    const [orders, setOrders] = useState([]);
    const [otpInputs, setOtpInputs] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/sell/sold', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setOrders(response.data);
            } catch (err) {
                setError('Failed to fetch orders.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const handleOTPChange = (orderId, value) => {
        setOtpInputs({ ...otpInputs, [orderId]: value });
    };

    const handleCompleteOrder = async (orderId) => {
        const enteredOTP = otpInputs[orderId] || '';
        if (!enteredOTP) {
            alert('Please enter the OTP.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/sell/verifyotp',
                { orderId, enteredOTP },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert('Order completed successfully!');
            setOrders(orders.filter(order => order._id !== orderId));
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to complete order.');
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="page">
            <h2>Deliver Items</h2>
            {orders.length === 0 && <p>No orders to deliver.</p>}
            <div className="order-grid">
                {orders.map(order => (
                    <div key={order._id} className="item-card">
                        <p><strong>Item:</strong> {order.itemName}</p>
                        <p><strong>Price:</strong> Rs.{order.price}</p>
                        <p><strong>Buyer:</strong> {order.buyer} </p>
                        <input type="text" placeholder="Enter OTP" value={otpInputs[order._id] || ''} onChange={(e) => handleOTPChange(order._id, e.target.value)} />
                        <button onClick={() => handleCompleteOrder(order._id)}>Complete Order</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DeliverItems;
