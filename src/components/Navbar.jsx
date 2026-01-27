// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useNostr } from '../context/NostrContext';
import { APP_NAME } from '../context/NostrContext'; // Import APP_NAME for branding

function Navbar() {
    const { publicKey } = useNostr();

    return (
        <nav className="bg-gray-800 p-4 w-full shadow-md top-0">
            <div className="container mx-auto flex justify-between items-center">
                {/* Brand/Home Link */}
                <Link to="/" className="text-white text-2xl font-bold hover:text-gray-300 transition-colors">
                    {APP_NAME.replace('-v0', '')}
                </Link>

                {/* Navigation Links */}
                <div className="flex space-x-6">
                    <Link to="/" className="text-gray-300 hover:text-white transition-colors text-lg">
                        Home
                    </Link>
                    {publicKey && (
                        // Show "My Pets" only if logged in
                        <Link to="/" className="text-gray-300 hover:text-white transition-colors text-lg">
                            My Pets
                        </Link>
                    )}
                    <Link to="/group-channel" className="text-gray-300 hover:text-white transition-colors text-lg">
                        Group Chat
                    </Link>
                    {/* Add more links here as your app grows */}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;