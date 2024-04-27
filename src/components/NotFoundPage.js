// NotFoundPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import './NotFoundPage.css'; // Import CSS file for styling

const NotFoundPage = () => {
  return (
    <div className="not-found">
       <h1>404 - Oops!!! Page Not Found 😞</h1>
      <p>We are sorry but the page you are looking for does not exist.</p>
      <Link to="/" className="back-button">Back to Home</Link>
    </div>
  );
};

export default NotFoundPage;
