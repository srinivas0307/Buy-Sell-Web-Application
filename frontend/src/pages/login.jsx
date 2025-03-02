import React, { useState } from 'react';
import axios from 'axios';
import ReCAPTCHA from 'react-google-recaptcha';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    const emailPattern = /^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\.)?iiit\.ac\.in$/;
    if (!emailPattern.test(email)) {
      alert('Please enter a valid IIIT email address (ending with @iiit.ac.in)');
      return;
    }
    if (!recaptchaToken) {
      alert('Please complete the reCAPTCHA verification');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', { email, password , recaptchaToken });
      localStorage.setItem('token', response.data.user);
      console.log(response.data);
      window.location.href = '/profile';
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Error logging in. Please try again.');
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Enter your email" />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Enter your password" />
        </div>
        <div className="form-group">
          <ReCAPTCHA sitekey="6LdhQ8wqAAAAAEZpe5YJqSjAZeqs7f25ORp75yoO" onChange={(token) => setRecaptchaToken(token)} />
        </div>
        <div className="form-group">
          <button type="submit">Login</button>
        </div>
        <p>  Don't have an account? <a href="/signup">Sign Up</a></p>
      </form>
    </div>
  );
};

export default Login;
