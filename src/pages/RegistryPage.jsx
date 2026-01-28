// src/pages/RegistryPage.jsx
import React, { useState } from 'react'; 
import { Helmet } from 'react-helmet-async'; 
import { useNostr } from '../context/NostrContext';
import { usePageTitle } from '../hooks/usePageTitle';

import AuthDisplay from '../components/AuthDisplay';
import PetRegistrationForm from '../components/PetRegistrationForm';
import PetList from '../components/PetList';
import AllPetsList from '../components/AllPetsList';

// This is the main content of your home page
function RegistryPage() {
    const { publicKey } = useNostr();
    // State to manage the active tab: 'myPets' or 'allPets'
    const [activeTab, setActiveTab] = useState('myPets'); // Default to 'myPets'
    usePageTitle('NosPetRegistry - Register Your Pet')
    const pageTitle = `${petProfile.name}'s Logbook - Nostr Pet Care`;
    const pageDescription = `Health logbook for ${petProfile.name}, a ${petProfile.race || 'pet'} born on ${petProfile.birthday ? new Date(petProfile.birthday).toLocaleDateString() : 'an unknown date'}. View vaccines, dewormings, and more on Nostr Pet Care.`;
    const ogTitle = `${petProfile.name}'s Health Logbook on Nostr Pet Care`;
    const ogDescription = `View ${petProfile.name}'s comprehensive health records, including vaccines, dewormings, and medical history. Powered by Nostr.`;
    const petImage = petProfile.image || null; // Fallback image
    const currentUrl = `https://nospetregistry.vercel.app/#/pet/${petProfile.id}`; // IMPORTANT: Adjust to your actual URL structure
    return (
        <div className="bg-gray-900 text-gray-100 p-8 rounded-lg w-full max-w-5xl mx-auto my-8 border border-gray-800"> {/* Added border to main container */}
            <Helmet>
                {/* Standard Meta Tags */}
                <title>NosPetRegistry - Register Your Pet</title>
                <meta name="description" content="Decentralized pet registry on Nostr. Register your pets, manage their profiles, and explore all registered pets in the community." />
                <meta name="keywords" content="Nostr, pet registry, decentralized, pets, dog, cat, blockchain, web3" />
                <link rel="canonical" href={currentUrl} /> {/* Essential for SEO */}

                {/* Open Graph Tags (for Facebook, LinkedIn, WhatsApp, Telegram, etc.) */}
                <meta property="og:url" content={currentUrl} />
                <meta property="og:type" content="website" />
                <meta property="og:title" content="NosPetRegistry: Decentralized Pet Registration" />
                <meta property="og:description" content="Register your pets and view the community's pet registry powered by Nostr." />
                <meta property="og:image" content={imageUrl} />
                <meta property="og:image:width" content="1200" /> {/* Recommended minimum 1200px width */}
                <meta property="og:image:height" content="630" /> {/* Recommended 630px height for 1.91:1 ratio */}
                <meta property="og:locale" content="en_US" /> {/* Specify the language */}
                <meta property="og:site_name" content="NosPetRegistry" /> {/* The name of your website */}

                {/* Twitter Card Tags (for Twitter) */}
                <meta name="twitter:card" content="summary_large_image" /> {/* Use 'summary_large_image' for a prominent image */}
                <meta name="twitter:site" content="@nos_pet1273" /> {/* Optional: Your Twitter handle */}
                <meta name="twitter:creator" content="@nos_pet1273" /> {/* Optional: Creator's Twitter handle */}
                <meta name="twitter:title" content="NosPetRegistry: Decentralized Pet Registration" />
                <meta name="twitter:description" content="Register your pets and view the community's pet registry powered by nostr." />
                <meta name="twitter:image" content={imageUrl} />
                <meta name="twitter:image:alt" content="A diverse group of happy pets with the NosPetRegistry logo." /> {/* Alt text for accessibility */}

                {/* Instagram (less direct, but uses OG tags) */}
                {/* Instagram mostly relies on OG image, title, and description. */}

                {/* Schema.org (Google Rich Snippets - Optional but good for SEO) */}
                {/* This is more advanced and can be added later if needed. */}

            </Helmet>
            
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