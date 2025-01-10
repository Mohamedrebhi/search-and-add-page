import React from 'react';
import { Navigate } from 'react-router-dom';

const Welcome = () => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="welcome-container">
            <h1>Welcome!</h1>
            <p>You have successfully logged in.</p>
        </div>
    );
};

export default Welcome;
