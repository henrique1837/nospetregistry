// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useNostr, APP_NAME } from '../context/NostrContext';
import { HomeIcon, ChatBubbleLeftRightIcon, ShieldCheckIcon } from '@heroicons/react/24/solid'; // Using solid icons for navbar

function Navbar() {
    const { publicKey } = useNostr();

    return (
        <nav className="bg-gray-900 border-b border-gray-700 p-4 w-full shadow-lg"> {/* Darker background, border, stronger shadow */}
            <div className="container mx-auto flex justify-between items-center">
                {/* Brand/Home Link */}
                <Link to="/" className="text-purple-400 text-2xl font-bold hover:text-purple-300 transition-colors flex items-center gap-2"> {/* Branded color, flex for icon */}
                    <ShieldCheckIcon className="h-7 w-7" /> {/* Brand icon */}
                    {APP_NAME.replace('-v0', '')}
                </Link>

                {/* Navigation Links */}
                <div className="flex space-x-6">
                    <Link to="/" className="text-gray-300 hover:text-white transition-colors text-lg flex items-center gap-1">
                        <HomeIcon className="h-5 w-5" /> Home
                    </Link>
                    <Link to="/group-channel" className="text-gray-300 hover:text-white transition-colors text-lg flex items-center gap-1">
                        <ChatBubbleLeftRightIcon className="h-5 w-5" /> Group Chat
                    </Link>
                    {/* Add more links here as your app grows */}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;