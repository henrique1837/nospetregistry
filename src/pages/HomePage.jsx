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
    usePageTitle('NosPetRegistry - Your Decentralized Pet Logbook')
    return (
        // Changed bg-white to bg-gray-900, removed shadow-md as it's less visible on dark background
        <div className="bg-gray-900 text-gray-100 p-8 rounded-lg w-full max-w-5xl mx-auto my-8"> {/* Added mx-auto my-8 for centering and vertical spacing */}
            <Helmet>
                <title>NosPetRegistry - Your Decentralized Pet Logbook</title>
                <meta name="description" content="Manage your pet's vaccines, dewormings, and health records securely on Nostr. Never lose vital pet information again." />
                <meta property="og:title" content="NosPetRegistry" />
                <meta property="og:description" content="Your Decentralized Pet Logbook" />
                {/* You can add more meta tags like og:image, twitter:card, etc. */}
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