// src/App.jsx
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async'; 
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import FeedbackPage from './pages/FeedbackPage';
import PetLogbookPage from './pages/PetLogbookPage'; 
import HomePage from './pages/HomePage';
import RegistryPage from './pages/RegistryPage';

import Navbar from './components/Navbar'; 
import Footer from './components/Footer'; 


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC6xPHQ1xCrBFveGXsggR_J6TxaJFmv-cI",
  authDomain: "nospetregistry.firebaseapp.com",
  projectId: "nospetregistry",
  storageBucket: "nospetregistry.firebasestorage.app",
  messagingSenderId: "182234856261",
  appId: "1:182234856261:web:a46d9099ef9fa215489c2c",
  measurementId: "G-4C4JWGMX9B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

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
                <Footer />
            </div>

        </Router>

        </HelmetProvider>
    );
}

export default App;