// src/components/Navbar.jsx
import React, { useState } from 'react'; // Import useState
import { Link } from 'react-router-dom';
import { useNostr, APP_NAME } from '../context/NostrContext';
import {
    HomeIcon,
    ChatBubbleLeftRightIcon,
    ShieldCheckIcon,
    HeartIcon,
    Bars3Icon, // Hamburger icon
    XMarkIcon // Close icon
} from '@heroicons/react/24/solid'; // Using solid icons for navbar

function Navbar() {
    const { publicKey } = useNostr();
    const [isMenuOpen, setIsMenuOpen] = useState(false); // State to manage mobile menu visibility

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="bg-gray-900 border-b border-gray-700 p-4 w-full shadow-lg">
            <div className="container mx-auto flex justify-between items-center">
                {/* Brand/Home Link */}
                <Link
                    to="/"
                    className="text-purple-400 text-2xl font-bold hover:text-purple-300 transition-colors flex items-center gap-2"
                    onClick={() => setIsMenuOpen(false)} // Close menu on brand click
                >
                    <ShieldCheckIcon className="h-7 w-7" />
                    {APP_NAME.replace('-v0', '')}
                </Link>

                {/* Mobile Menu Button (Hamburger/X icon) */}
                <div className="md:hidden"> {/* Show only on medium and smaller screens */}
                    <button onClick={toggleMenu} className="text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-md">
                        {isMenuOpen ? (
                            <XMarkIcon className="h-7 w-7" /> // Show X icon when menu is open
                        ) : (
                            <Bars3Icon className="h-7 w-7" /> // Show hamburger icon when menu is closed
                        )}
                    </button>
                </div>

                {/* Navigation Links - Desktop */}
                <div className="hidden md:flex space-x-6"> {/* Hide on small, show on medium and larger screens */}
                    <Link to="/" className="text-gray-300 hover:text-white transition-colors text-lg flex items-center gap-1">
                        <HomeIcon className="h-5 w-5" /> Home
                    </Link>
                    <Link to="/my-pets" className="text-gray-300 hover:text-white transition-colors text-lg flex items-center gap-1">
                        <HeartIcon className="h-5 w-5" /> Pets
                    </Link>
                    <Link to="/group-channel" className="text-gray-300 hover:text-white transition-colors text-lg flex items-center gap-1">
                        <ChatBubbleLeftRightIcon className="h-5 w-5" /> Group Chat
                    </Link>
                    {/* Add more links here as your app grows */}
                </div>
            </div>

            {/* Mobile Navigation Links (Dropdown) */}
            {isMenuOpen && ( // Only render when isMenuOpen is true
                <div className="md:hidden mt-4 space-y-3 px-2 pb-3"> {/* Show only on small screens, spacing, padding */}
                    <Link
                        to="/"
                        className="block text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-md text-base font-medium flex items-center gap-2"
                        onClick={toggleMenu} // Close menu on link click
                    >
                        <HomeIcon className="h-5 w-5" /> Home
                    </Link>
                    <Link
                        to="/my-pets"
                        className="block text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-md text-base font-medium flex items-center gap-2"
                        onClick={toggleMenu}
                    >
                        <HeartIcon className="h-5 w-5" /> Pets
                    </Link>
                    <Link
                        to="/group-channel"
                        className="block text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-md text-base font-medium flex items-center gap-2"
                        onClick={toggleMenu}
                    >
                        <ChatBubbleLeftRightIcon className="h-5 w-5" /> Group Chat
                    </Link>
                    {/* Add more mobile links here */}
                </div>
            )}
        </nav>
    );
}

export default Navbar;