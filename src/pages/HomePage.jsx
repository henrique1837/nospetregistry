// src/pages/HomePage.jsx
import { useNostr } from '../context/NostrContext';

import AuthDisplay from '../components/AuthDisplay';
import PetRegistrationForm from '../components/PetRegistrationForm';
import PetList from '../components/PetList';
import AllPetsList from '../components/AllPetsList';
import NostrConnectInfo from '../components/NostrConnectInfo';

// This is the main content of your home page
function HomePage() {
    const { publicKey } = useNostr();

    return (
        // Changed bg-white to bg-gray-900, removed shadow-md as it's less visible on dark background
        <div className="bg-gray-900 text-gray-100 p-8 rounded-lg w-full max-w-5xl mx-auto my-8"> {/* Added mx-auto my-8 for centering and vertical spacing */}
            <AuthDisplay />
            <NostrConnectInfo publicKey={publicKey}/>
        </div>
    );
}

export default HomePage;