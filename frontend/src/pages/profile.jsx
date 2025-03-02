import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { set } from 'mongoose';

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editFormData, setEditFormData] = useState({});
    const [showPasswordChange, setShowPasswordChange] = useState(false);
    const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/profile/data', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUserData(response.data);
            } catch (error) {
                alert(error.response?.data?.message || 'Error fetching user data. Please try again.');
                console.error('Error fetching user data', error);
            }
        };

        fetchData();
    }, []);

    const handleEditToggle = () => {
        setEditFormData(userData);
        setIsEditing(!isEditing);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditFormData({ ...editFormData, [name]: value });
    };

    const handlePasswordChangeInput = (e) => {
        const { name, value } = e.target;
        setPasswordData({ ...passwordData, [name]: value });
    };

    const clearreviews = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put('http://localhost:5000/api/profile/clear-reviews', {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUserData(response.data);
            alert('User reviews cleared successfully.');
            setIsEditing(false);
        } catch (error) {
            console.error('Error clearing user reviews', error);
            alert(error.response?.data?.message || 'Error clearing user reviews. Please try again.');
        }
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put('http://localhost:5000/api/profile/update', editFormData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUserData(response.data);
            alert('User data updated successfully.');
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating user data', error);
            alert(error.response?.data?.message || 'Error updating user data. Please try again.');
        }
    };

    const handlePasswordChange = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert('New password and confirmation do not match.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/profile/change-password', passwordData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            alert('Password changed successfully.');
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setShowPasswordChange(false);
        } catch (error) {
            alert(error.response?.data?.message || 'Error changing password. Please try again.');
            console.error('Error changing password', error);
        }
    };

    if (!userData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="page">
            <h1>Profile</h1>
            <p>Welcome to your profile</p>
            {isEditing ? (
                <div>
                    <label>
                        First Name:
                        <input type="text" name="firstName" value={editFormData.firstName || ''} onChange={handleInputChange} />
                    </label>
                    <label>
                        Last Name:
                        <input type="text" name="lastName" value={editFormData.lastName || ''} onChange={handleInputChange} />
                    </label>
                    <label>
                        Email:
                        <input type="email" name="email" value={userData.email} disabled />
                    </label>
                    <label>
                        Age:
                        <input type="number" name="age" value={editFormData.age || ''} onChange={handleInputChange} />
                    </label>
                    <label>
                        Contact:
                        <input type="text" name="contact" value={editFormData.contact || ''} onChange={handleInputChange} />
                    </label>
                    <button onClick={clearreviews}>Clear Reviews</button>
                    <button onClick={handleSave}>Save</button>
                    <button onClick={() => setIsEditing(false)}>Cancel</button>
                </div>
            ) : (
                <div className='profile-data'>
                    <p><strong>First Name:</strong> {userData.firstName}</p>
                    <p><strong>Last Name:</strong> {userData.lastName}</p>
                    <p><strong>Email:</strong> {userData.email}</p>
                    <p><strong>Age:</strong> {userData.age}</p>
                    <p><strong>Contact:</strong> {userData.contact}</p>
                    {/* <p><strong>Items in Cart:</strong> {userData.itemsInCart.length > 0 ? userData.itemsInCart.join(", ") : "No items in cart"}</p> */}
                    <p><strong>Seller Reviews:</strong>
                        {userData.sellerReviews && userData.sellerReviews.length > 0 ? (
                            <ul>
                                {userData.sellerReviews.map((review, index) => (
                                    <li key={index}>
                                        <strong>Buyer:{review.buyername}</strong><br></br>
                                        <strong>Item:{review.itemname}</strong><br></br>
                                        <strong>Review:</strong>{review.review}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            " No reviews available"
                        )}
                    </p>
                    <button onClick={handleEditToggle}>Edit</button>
                </div>
            )}
            {!showPasswordChange ? (
                <button onClick={() => setShowPasswordChange(true)}>Change Password</button>
            ) : (
                <div>
                    <h3>Change Password</h3>
                    <label>
                        Current Password:
                        <input type="password" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChangeInput} />
                    </label>
                    <label>
                        New Password:
                        <input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChangeInput} />
                    </label>
                    <label>
                        Confirm New Password:
                        <input type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChangeInput} />
                    </label>
                    <button onClick={handlePasswordChange}>Save Password</button>
                    <button onClick={() => setShowPasswordChange(false)}>Cancel</button>
                </div>
            )}
        </div>
    );
};

export default Profile;
