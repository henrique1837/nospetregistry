// src/pages/RegistryPage.jsx
import React, { useState } from 'react'; // Import useState
import { useNostr } from '../context/NostrContext';

import AuthDisplay from '../components/AuthDisplay';
import PetRegistrationForm from '../components/PetRegistrationForm';
import PetList from '../components/PetList';
import AllPetsList from '../components/AllPetsList';

// This is the main content of your home page
function RegistryPage() {
    const { publicKey } = useNostr();
    // State to manage the active tab: 'myPets' or 'allPets'
    const [activeTab, setActiveTab] = useState('myPets'); // Default to 'myPets'
    return (
        <div className="bg-gray-900 text-gray-100 p-8 rounded-lg w-full max-w-5xl mx-auto my-8 border border-gray-800"> {/* Added border to main container */}
            <AuthDisplay />

            {publicKey && ( // Only show tab options if logged in
                <div className="mb-8 border-t border-gray-700 pt-8"> {/* Separator for the tab section */}
                    <div className="flex justify-center mb-6 space-x-4">
                        <button
                            onClick={() => setActiveTab('myPets')}
                            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 text-lg ${
                                activeTab === 'myPets'
                                    ? 'bg-purple-600 text-white shadow-lg'
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                            }`}
                        >
                            Register & My Pets
                        </button>
                        <button
                            onClick={() => setActiveTab('allPets')}
                            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 text-lg ${
                                activeTab === 'allPets'
                                    ? 'bg-purple-600 text-white shadow-lg'
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                            }`}
                        >
                            All Pets
                        </button>
                    </div>

                    {/* Content based on active tab */}
                    {activeTab === 'myPets' && (
                        <div>
                            {/* PetRegistrationForm and PetList moved here */}
                            <PetRegistrationForm />
                            <PetList />
                        </div>
                    )}
                    {activeTab === 'allPets' && (
                        <div>
                            {/* AllPetsList moved here */}
                            <AllPetsList />
                        </div>
                    )}
                </div>
            )}

            {/* If not logged in, only show AllPetsList (or a message to log in) */}
            {!publicKey && (
                <div className="mb-8 border-t border-gray-700 pt-8">
                    <h2 className="text-2xl font-semibold text-white mb-6">Explore All Registered Pets</h2>
                    <AllPetsList />
                </div>
            )}
        </div>
    );
}

export default RegistryPage;