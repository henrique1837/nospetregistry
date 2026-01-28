// src/pages/HomePage.jsx
import { Helmet } from 'react-helmet-async'; // Import Helmet
import { usePageTitle } from '../hooks/usePageTitle';
import { GROUP_CHAT_ID } from '../context/NostrContext';


import AuthDisplay from '../components/AuthDisplay';
import GroupChat from '../components/GroupChat';


// This is the main content of your home page
function FeedbackPage() {
    usePageTitle('Feedbacks');
    const pageTitle = "Give Feedback | Suggestions for NosPetRegistry";
    const pageDescription = "Share your valuable feedback, suggestions, or send us a message about NosPetRegistry. Help us improve our decentralized pet logbook and registry!";
    const ogTitle = "NosPetRegistry: Share Your Feedback & Ideas";
    const ogDescription = "We value your input! Send us your suggestions, report issues, or just share your thoughts about NosPetRegistry, the decentralized pet logbook.";
    const imageUrl = null; // IMPORTANT: Replace with a relevant image
    const currentUrl = "https://nospetregistry.vercel.app/#/feedbacks"; // IMPORTANT: Adjust to your actual URL for this page

    return (
        // Changed bg-white to bg-gray-900, removed shadow-md as it's less visible on dark background
        <div className="bg-gray-900 text-gray-100 p-8 rounded-lg w-full max-w-5xl mx-auto my-8"> {/* Added mx-auto my-8 for centering and vertical spacing */}
            <Helmet>
                {/* Standard Meta Tags */}
                <title>{pageTitle}</title>
                <meta name="description" content={pageDescription} />
                <meta name="keywords" content="Nostr, pet registry, feedback, suggestions, contact, decentralized, pet logbook, improvements" />
                <link rel="canonical" href={currentUrl} />

                {/* Open Graph Tags (for Facebook, LinkedIn, WhatsApp, Telegram, etc.) */}
                <meta property="og:url" content={currentUrl} />
                <meta property="og:type" content="website" /> {/* 'website' is appropriate for a general page */}
                <meta property="og:title" content={ogTitle} />
                <meta property="og:description" content={ogDescription} />
                <meta property="og:image" content={imageUrl} />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta property="og:locale" content="en_US" />
                <meta property="og:site_name" content="NosPetRegistry" />

                {/* Twitter Card Tags (for Twitter) */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@nos_pet1273" /> {/* Your project's Twitter handle */}
                <meta name="twitter:creator" content="@nos_pet1273" /> {/* Or the organization's handle */}
                <meta name="twitter:title" content={ogTitle} />
                <meta name="twitter:description" content={ogDescription} />
                <meta name="twitter:image" content={imageUrl} />
                <meta name="twitter:image:alt" content="Illustration of user feedback, suggestions, or ideas being collected for NosPetRegistry." /> {/* Alt text for accessibility */}

            </Helmet>
            <GroupChat channelId={GROUP_CHAT_ID}/>
            <AuthDisplay />
        </div>
    );
}

export default FeedbackPage;