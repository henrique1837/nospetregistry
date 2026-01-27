// src/App.jsx
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async'; 

import FeedbackPage from './pages/FeedbackPage';
import PetLogbookPage from './pages/PetLogbookPage'; 
import HomePage from './pages/HomePage';
import RegistryPage from './pages/RegistryPage';

import Navbar from './components/Navbar'; 



function App() {
    const helmetContext = {};

    return (
        <HelmetProvider context={helmetContext}>
        <Router>
            <Navbar />
            <div className="min-h-screen bg-gray-950 flex flex-col items-center py-8 px-4">
              <h1 className="text-4xl font-bold text-white mb-8">Nostr Pet Registry App</h1>
            <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/my-pets" element={<RegistryPage />} />

                    <Route path="/pet/:petId" element={<PetLogbookPage />} />
                    <Route path="/group-channel" element={<FeedbackPage />} />
                </Routes>
            </div>
        </Router>
        </HelmetProvider>
    );
}

export default App;