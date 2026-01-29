import React from 'react';
import { Link } from 'react-router-dom';
import { DocumentTextIcon } from '@heroicons/react/24/outline';

function PetProfileHeader({ petProfile }) {
    return (
        <div className="mb-10 p-6 bg-gray-800 rounded-lg border border-gray-700">
            <Link to="/my-pets" className="text-purple-400 hover:text-purple-300 hover:underline mb-6 block w-fit text-sm flex items-center gap-1">
                <DocumentTextIcon className="h-4 w-4" /> Back to All Pets
            </Link>
            <h1 className="text-3xl font-bold text-white mb-6 border-b border-gray-700 pb-4">
                Logbook for <span className="text-indigo-400">{petProfile.name}</span>
            </h1>
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
                {petProfile.image && (
                    <img src={petProfile.image} alt={petProfile.name} className="w-32 h-32 object-cover rounded-full shadow-lg border-2 border-purple-500 flex-shrink-0" />
                )}
                <div className="flex flex-col justify-center items-center md:items-start text-center md:text-left flex-grow">
                    <h3 className="text-2xl font-bold text-white mb-2">{petProfile.name}</h3>
                    <p className="text-gray-300 mb-1"><span className="font-semibold text-purple-300">Breed:</span> {petProfile.race}</p>
                    <p className="text-gray-300 mb-1"><span className="font-semibold text-purple-300">Birthday:</span> {petProfile.birthday}</p>
                    <small className="text-gray-400 block mt-2">Owner: {petProfile.ownerPubKey ? petProfile.ownerPubKey.substring(0, 6) + '...' : 'Unknown'}</small>
                </div>
            </div>
        </div>
    );
}

export default PetProfileHeader;