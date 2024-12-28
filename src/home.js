import React from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation
import './home.css';

const HomePage = () => {
  const navigate = useNavigate();

  const navigateToSearchPage = () => {
    navigate('/search'); // Redirect to the Search Page
  };

  const navigateToAjoutePage = () => {
    navigate('/form'); // Redirect to the Formulaire (Ajoute) Page
  };

  return (
    <div className="home-container">
      <h2 className="home-title">Welcome to the Dashboard</h2>
      <div className="button-container">
        <button className="home-button" onClick={navigateToSearchPage}>Search</button>
        <button className="home-button" onClick={navigateToAjoutePage}>Ajoute</button>
      </div>
    </div>
  );
};

export default HomePage;
