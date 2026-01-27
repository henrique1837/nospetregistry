// src/components/AllPetsList.jsx
import React, { useEffect, useState } from 'react';
import { useNostr, APP_NAME, GROUP_CHAT_ID } from '../context/NostrContext';
// No need to import Link here if only PetCard is used
import PetCard from './PetCard';

const KIND_PET_PROFILE = 42;

function AllPetsList() {
    const { publicKey, subscribeToEvents } = useNostr(); // publicKey is still needed for useNostr
    const [allPets, setAllPets] = useState([]);

    useEffect(() => {
        const filter = {
            kinds: [KIND_PET_PROFILE],
            '#d': [APP_NAME],
            '#e': [GROUP_CHAT_ID]
        };

        console.log("Subscribing to all pets with filter:", filter);

        subscribeToEvents(filter, (event) => {
            try {
                console.log(event);
                const petData = JSON.parse(event.content);
                // Ensure ownerPubKey is included for PetCard, even if not explicitly in event.content
                const ownerPubKey = event.pubkey; 

                setAllPets(prevPets => {
                    const existingIndex = prevPets.findIndex(p => p.id === event.id);
                    if (existingIndex > -1) {
                        const updatedPets = [...prevPets];
                        updatedPets[existingIndex] = { ...petData, id: event.id, ownerPubKey }; // Add ownerPubKey here
                        return updatedPets;
                    }
                    return [...prevPets, { ...petData, id: event.id, ownerPubKey }]; // Add ownerPubKey here
                });
            } catch (e) {
                console.error("Error parsing pet event content or tags:", e, event);
            }
        });

        return () => {
            // Unsubscribe logic if available in subscribeToEvents
        };
    }, [subscribeToEvents]); // publicKey is not a direct dependency for *all* pets subscription filter

    return (
        <div className="mb-8 border-t border-gray-700 pt-8"> {/* Added border-t and pt-8, adjusted mb */}
            <h2 className="text-2xl font-semibold text-white mb-6">All Registered Pets</h2> {/* Changed text-gray-800 to text-white, mb-4 to mb-6, removed mt-10 and pt-6 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allPets.length === 0 ? (
                    <p className="text-gray-400 italic md:col-span-2 lg:col-span-3">No pets have been registered yet.</p>
                ) : (
                    allPets.map((pet) => (
                        <PetCard key={pet.id} pet={pet} />
                    ))
                )}
            </div>
        </div>
    );
}

export default AllPetsList;