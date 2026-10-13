import React from 'react';
import './ErrorPage.css';

const ErrorPage = () => {
  return (
    <div className="error-container">
      <h1>Oops! Something Went Wrong</h1>
      <p>Please try again later.</p>
      <img src="/alert.png" alt="Error Alert" className="error-image" />
    </div>
  );
};

export default ErrorPage;