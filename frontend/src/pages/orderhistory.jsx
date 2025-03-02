import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const OrdersHistory = () => {
    const [activeTab, setActiveTab] = useState('pending');
    const [pendingOrders, setPendingOrders] = useState([]);
    const [boughtItems, setBoughtItems] = useState([]);
    const [soldItems, setSoldItems] = useState([]);
    const [error, setError] = useState(null);
    const [reviewText, setReviewText] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');

        axios.get('http://localhost:5000/api/orders/pending', {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(response => {
                setPendingOrders(response.data);
            })
            .catch(handleError);

        axios.get('http://localhost:5000/api/orders/completed', {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(response => {
                setBoughtItems(response.data);
            })
            .catch(handleError);

        axios.get('http://localhost:5000/api/orders/sold', {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(response => {
                setSoldItems(response.data);
            })
            .catch(handleError);
    }, [navigate]);

    const generateOTP = async (orderId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error("No authentication token found.");
                return;
            }

            const response = await axios.post(
                `http://localhost:5000/api/orders/generateotp`,
                { orderId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert("OTP Generated Successfully! and the new OTP is: " + response.data.otp);
        } catch (error) {
            console.error("Error generating OTP", error);
            alert("Failed to generate OTP. Please try again.");
        }
    };

    const handleError = (error) => {
        console.error('Error:', error);
        if (error.response?.status === 401) {
            setError('Session expired. Please log in again.');
            navigate('/login');
        } else {
            setError('An error occurred while fetching data. Please try again later.');
        }
    };

    const handleReviewChange = (itemId, text) => {
        setReviewText(prev => ({ ...prev, [itemId]: text }));
    };

    const submitReview = async (sellerId, itemId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error("No authentication token found.");
                return;
            }

            await axios.post(
                'http://localhost:5000/api/orders/review',
                { sellerId, review: reviewText[itemId] || '', itemid: itemId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert("Review submitted successfully!");
            setReviewText(prev => ({ ...prev, [itemId]: '' }));
        } catch (error) {
            console.error("Error submitting review", error);
            alert(error.response?.data?.message || "Failed to submit review. Please try again.");
        }
    };

    const renderPendingOrders = () => (
        <div className="tab-content">
            {pendingOrders.length === 0 ? (
                <p>No pending orders</p>
            ) : (
                pendingOrders.map(order => (
                    <div key={order._id} className="item-card">
                        <h4>{order.itemName}</h4>
                        <p>Price: Rs.{order.price}</p>
                        <p>Status: Pending</p>
                        <p>Seller:{order.seller}</p>
                        <button onClick={() => generateOTP(order._id)}>Generate OTP</button>
                    </div>
                ))
            )}
        </div>
    );

    const renderBoughtItems = () => (
        <div className="tab-content">
            {boughtItems.length === 0 ? (
                <p>No items bought yet</p>
            ) : (
                boughtItems.map(item => (
                    <div key={item._id} className="item-card">
                        <h4>{item.itemName}</h4>
                        <p>Price: Rs.{item.price}</p>
                        <p>Seller: {item.seller}</p>
                        <p>Date: {item.date}</p>
                        {item.reviewed ? (
                            <p>Review Submitted</p>
                        ) : (
                            <>
                                <textarea value={reviewText[item._id] || ''} onChange={(e) => handleReviewChange(item._id, e.target.value)} placeholder="Enter your review" className="Review" />
                                <button onClick={() => submitReview(item.sellerid, item._id)}>
                                    Submit Review
                                </button>
                            </>
                        )}
                    </div>
                ))
            )}
        </div>
    );


    const renderSoldItems = () => (
        <div className="tab-content">
            {soldItems.length === 0 ? (
                <p>No items sold yet</p>
            ) : (
                soldItems.map(item => (
                    <div key={item._id} className="item-card">
                        <h4>{item.itemName}</h4>
                        <p>Price: Rs.{item.price}</p>
                        <p>Buyer: {item.buyer}</p>
                        <p>Date: {item.date}</p>
                    </div>
                ))
            )}
        </div>
    );

    return (
        <div className="page">
            <h2>Orders History</h2>
            {error && <p className="error-message">{error}</p>}
            <div className="tabs">
                <button className={activeTab === 'pending' ? 'active' : ''} onClick={() => setActiveTab('pending')}>    Pending Orders</button>
                <button className={activeTab === 'bought' ? 'active' : ''} onClick={() => setActiveTab('bought')}>    Bought Items</button>
                <button className={activeTab === 'sold' ? 'active' : ''} onClick={() => setActiveTab('sold')}>    Sold Items </button>
            </div>

            <div className="tab-contents">
                {activeTab === 'pending' && renderPendingOrders()}
                {activeTab === 'bought' && renderBoughtItems()}
                {activeTab === 'sold' && renderSoldItems()}
            </div>
        </div>
    );
};

export default OrdersHistory;
