import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';
import './style.css'; // Global styles for Home
import WhatsAppButton from './components/WhatsAppButton';

function App() {
  return (
    <Router>
      <WhatsAppButton />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;
