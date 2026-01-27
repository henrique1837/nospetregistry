// src/components/PetCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { PhotoIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid';

const PetCard = ({ pet }) => {
    const imageUrl = pet.image || null;

    const nostrEventUrl = (petId) => {
        return `https://nostr.band/?q=${petId}`;
    };

    return (
        <div className="bg-gray-800/50 rounded-lg border border-gray-700 group relative transition-all duration-300 ease-in-out hover:border-indigo-500 hover:scale-[1.03] hover:bg-gray-800">
            {/* Main clickable area for the pet details */}
            <Link to={`/pet/${pet.id}`} className="cursor-pointer block">
                {/* Changed aspect-video to aspect-[3/2] for a taller image area */}
                <div className="aspect-[3/4] w-full bg-gray-900 flex items-center justify-center overflow-hidden">
                    {imageUrl ? (
                        <img src={imageUrl} alt={pet.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                    ) : (
                        <PhotoIcon className="h-12 w-12 text-gray-600" />
                    )}
                </div>
                <div className="p-4">
                    <h3 className="font-semibold text-white truncate" title={pet.name}>{pet.name}</h3>
                    <p className="text-sm text-gray-400 mt-1">
                        <span className="font-semibold">Breed:</span> {pet.race}
                    </p>
                    <p className="text-sm text-gray-400">
                        <span className="font-semibold">Birthday:</span> {pet.birthday}
                    </p>
                    <p className="text-xs text-gray-500 mt-2 truncate" title={`Owner: ${pet.ownerPubKey}`}>
                        Owner: {pet.ownerPubKey.substring(0, 6)}...
                    </p>
                </div>
            </Link>

            {/* Footer with external links/actions */}
            <div className="border-t border-gray-600 p-2 flex justify-between items-center bg-gray-800/40">
                <Link to={`/pet/${pet.id}`} className="text-xs text-indigo-300 hover:text-indigo-200 font-semibold transition-colors">
                    View Details
                </Link>
                <a
                    href={nostrEventUrl(pet.id)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
                    title="View Nostr Event"
                >
                    Event ID: {pet.id.substring(0, 6)}...
                    <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                </a>
            </div>
        </div>
    );
};

export default PetCard;