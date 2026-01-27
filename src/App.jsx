// src/App.jsx
import React from 'react';
import { GROUP_CHAT_ID } from './context/NostrContext';
import { HashRouter as Router, Routes, Route } from 'react-router-dom'; // Import Router components

import GroupChat from './components/GroupChat';
import PetLogbookPage from './pages/PetLogbookPage'; // New import
import HomePage from './pages/HomePage';
import Navbar from './components/Navbar'; // Import the Navbar component



function App() {
    return (
        <Router>
            <Navbar />
            <div className="min-h-screen bg-gray-950 flex flex-col items-center py-8 px-4">
              <h1 className="text-4xl font-bold text-white mb-8">Nostr Pet Registry App</h1>
            <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/pet/:petId" element={<PetLogbookPage />} />
                    <Route path="/group-channel" element={<GroupChat channelId={GROUP_CHAT_ID} />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;