// src/pages/HomePage.jsx
import { Helmet } from 'react-helmet-async'; // Import Helmet
import { usePageTitle } from '../hooks/usePageTitle';

import { useNostr } from '../context/NostrContext';

import AuthDisplay from '../components/AuthDisplay';
import AboutNosPetRegistry from '../components/AboutNosPetRegistry';
import NostrConnectInfo from '../components/NostrConnectInfo';

// This is the main content of your home page
function HomePage() {
    const { publicKey } = useNostr();
    const pageTitle = "NosPetRegistry - Your Decentralized Pet Logbook";
    const pageDescription = "Manage your pet's vaccines, dewormings, and health records securely on Nostr. Never lose vital pet information again with our decentralized pet logbook.";
    const ogTitle = "NosPetRegistry: Decentralized Pet Logbook & Health Records";
    const ogDescription = "Securely manage all your pet's health information – vaccines, dewormings, medical history – on the Nostr protocol. Keep vital records safe and accessible.";
    const imageUrl = null; // IMPORTANT: Replace with a compelling image for this page
    const currentUrl = "https://nospetregistry.vercel.app/"; // IMPORTANT: Adjust to your actual URL for this page
    usePageTitle('NosPetRegistry - Your Decentralized Pet Logbook')
    return (
        // Changed bg-white to bg-gray-900, removed shadow-md as it's less visible on dark background
        <div className="bg-gray-900 text-gray-100 p-8 rounded-lg w-full max-w-5xl mx-auto my-8"> {/* Added mx-auto my-8 for centering and vertical spacing */}
            <Helmet>
                {/* Standard Meta Tags */}
                <title>{pageTitle}</title>
                <meta name="description" content={pageDescription} />
                <meta name="keywords" content="Nostr, pet logbook, decentralized, pet health, vaccines, deworming, pet records, blockchain, web3" />
                <link rel="canonical" href={currentUrl} />

                {/* Open Graph Tags (for Facebook, LinkedIn, WhatsApp, Telegram, etc.) */}
                <meta property="og:url" content={currentUrl} />
                <meta property="og:type" content="website" /> {/* 'website' is appropriate for a general page */}
                <meta property="og:title" content={ogTitle} />
                <meta property="og:description" content={ogDescription} />
                {/*
                <meta property="og:image" content={imageUrl} />
                <meta property="og:image:width" content="1200" /> 
                <meta property="og:image:height" content="630" /> 
                */}
                <meta property="og:locale" content="en_US" />
                <meta property="og:site_name" content="NosPetRegistry" />

                {/* Twitter Card Tags (for Twitter) */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@nos_pet1273" /> {/* Your project's Twitter handle */}
                <meta name="twitter:creator" content="@nos_pet1273" /> {/* Or the organization's handle */}
                <meta name="twitter:title" content={ogTitle} />
                <meta name="twitter:description" content={ogDescription} />
                <meta name="twitter:image" content={imageUrl} />
                <meta name="twitter:image:alt" content="Digital pet logbook showing health records and pet profiles." /> {/* Alt text for accessibility */}

            </Helmet>
            <AboutNosPetRegistry /> 
            {/* Authentication and Connection Info */}
            <section className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8 text-center">
                <h2 className="text-3xl font-bold text-blue-400 mb-4">Get Started</h2>
                <AuthDisplay />
                <NostrConnectInfo publicKey={publicKey}/>
            </section>
        </div>
    );
}

export default HomePage;