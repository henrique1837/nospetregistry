// src/pages/HomePage.jsx
import { Helmet } from 'react-helmet-async'; // Import Helmet
import { usePageTitle } from '../hooks/usePageTitle';
import { GROUP_CHAT_ID } from '../context/NostrContext';


import AuthDisplay from '../components/AuthDisplay';
import GroupChat from '../components/GroupChat';


// This is the main content of your home page
function FeedbackPage() {
    usePageTitle('Feedbacks')
    return (
        // Changed bg-white to bg-gray-900, removed shadow-md as it's less visible on dark background
        <div className="bg-gray-900 text-gray-100 p-8 rounded-lg w-full max-w-5xl mx-auto my-8"> {/* Added mx-auto my-8 for centering and vertical spacing */}
            <Helmet>
                <title>Feedbacks</title>
                <meta name="description" content="Suggestions, feedbacks or just send some message with a feedback" />
                <meta property="og:title" content="NosPetRegistry" />
                <meta property="og:description" content="Your Decentralized Pet Logbook" />
                {/* You can add more meta tags like og:image, twitter:card, etc. */}
            </Helmet>
            <GroupChat channelId={GROUP_CHAT_ID}/>
            <AuthDisplay />
        </div>
    );
}

export default FeedbackPage;