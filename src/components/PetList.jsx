// src/components/PetList.jsx
import React, { useEffect, useState } from 'react';
import { useNostr, APP_NAME, GROUP_CHAT_ID } from '../context/NostrContext';
import PetCard from './PetCard';

const KIND_PET_PROFILE = 42;

function PetList() {
    const { publicKey, subscribeToEvents } = useNostr();
    const [myPets, setMyPets] = useState([]);

    useEffect(() => {
        if (!publicKey) {
            setMyPets([]);
            return;
        }

        const filter = {
            kinds: [KIND_PET_PROFILE],
            authors: [publicKey],
            '#d': [APP_NAME],
            '#e': [GROUP_CHAT_ID]
        };

        console.log("Subscribing to my pets with filter:", filter);

        subscribeToEvents(filter, (event) => {
            try {
                const petData = JSON.parse(event.content);
                const ownerPubKey = event.pubkey;

                setMyPets(prevPets => {
                    const existingIndex = prevPets.findIndex(p => p.id === event.id);
                    if (existingIndex > -1) {
                        const updatedPets = [...prevPets];
                        updatedPets[existingIndex] = { ...petData, id: event.id, ownerPubKey };
                        return updatedPets;
                    }
                    return [...prevPets, { ...petData, id: event.id, ownerPubKey }];
                });
            } catch (e) {
                console.error("Error parsing pet event content or tags:", e, event);
            }
        });

        return;
    }, [publicKey, subscribeToEvents]);

    if (!publicKey) return null;

    return (
        <div className="mb-8 border-t border-gray-700 pt-8"> {/* Added border-t and pt-8, adjusted mb */}
            <h2 className="text-2xl font-semibold text-white mb-6">My Registered Pets</h2> {/* Changed text-gray-800 to text-white, mb-4 to mb-6, removed mt-10 and pt-6 as border-t on parent handles it */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myPets.length === 0 ? (
                    <p className="text-gray-400 italic md:col-span-2 lg:col-span-3">You haven't registered any pets yet.</p>
                ) : (
                    myPets.map((pet) => (
                        <PetCard key={pet.id} pet={pet} />
                    ))
                )}
            </div>
        </div>
    );
}

export default PetList;