import React, { useState } from 'react';
import axios from 'axios';

const Signup = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [age, setAge] = useState('');
    const [contact, setContact] = useState('');
    const [password, setPassword] = useState('');
    const [confirmpassword, setConfirmPassword] = useState('');

    const handleSignup = async (event) => {
        event.preventDefault();

        if (password !== confirmpassword) {
            alert('Passwords do not match!');
            return;
        }

        const emailPattern = /^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\.)?iiit\.ac\.in$/;
        if (!emailPattern.test(email)) {
            alert('Please enter a valid IIIT email address (ending with @iiit.ac.in)');
            return;
        }

        const contactPattern = /^[0-9]{10}$/;
        if (!contactPattern.test(contact)) {
            alert('Please enter a valid 10-digit contact number.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/users/signup', {
                firstName,
                lastName,
                email,
                age,
                contact,
                password,
            });

            localStorage.setItem('token', response.data.user);

            window.location.href = '/profile';
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Error signing up. Please try again.');
        }
    };

    return (
        <div className="signin-container">
            <h2>Sign Up</h2>
            <form onSubmit={handleSignup}>
                <div className="form-group">
                    <label htmlFor="firstName">First Name:</label>
                    <input type="text" id="firstName" name="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required placeholder="Enter your first name" />
                </div>
                <div className="form-group">
                    <label htmlFor="lastName">Last Name:</label>
                    <input type="text" id="lastName" name="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required placeholder="Enter your last name" />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Enter your IIIT email" />
                </div>
                <div className="form-group">
                    <label htmlFor="age">Age:</label>
                    <input type="number" id="age" name="age" value={age} onChange={(e) => setAge(e.target.value)} required placeholder="Enter your age" />
                </div>
                <div className="form-group">
                    <label htmlFor="contact">Contact Number:</label>
                    <input type="text" id="contact" name="contact" value={contact} onChange={(e) => setContact(e.target.value)} required placeholder="Enter your contact number" />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Create a password" />
                </div>
                <div className="form-group">
                    <label htmlFor="confirm_password">Confirm Password:</label>
                    <input type="password" id="confirm_password" name="confirm_password" value={confirmpassword} onChange={(e) => setConfirmPassword(e.target.value)} required placeholder="Confirm your password" />
                </div>
                <div className="form-group">
                    <button type="submit">Sign Up</button>
                </div>
                <p>
                    Already have an account? <a href="/login">Login</a>
                </p>
            </form>
        </div>
    );
};

export default Signup;
