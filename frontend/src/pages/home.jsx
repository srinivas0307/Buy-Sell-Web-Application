//home page for my website where the user had to login or signup to access the website
import React from "react";

const Home = () => {
  return (
    <div className="container">
      <h2>Welcome to my website</h2>
      <p>
        Please <a href="/login">Login</a> or <a href="/signup">Sign Up</a> to access the website.
      </p>
    </div>
  );
}

export default Home;