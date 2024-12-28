import React from 'react';
import { BrowserRouter as Router, Route, Routes  } from 'react-router-dom';
import HomePage from './home';
import SearchPage from './search';
import FormulairePage from './form'; // Rename based on your actual file


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/form" element={<FormulairePage />} />
      </Routes>
    </Router>
  );
};

export default App;
