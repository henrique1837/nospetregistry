// src/components/AboutNosPetRegistry.jsx
import React from 'react';
import { ShieldCheckIcon, HeartIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline'; // Import icons

function AboutNosPetRegistry() {
    return (
        <section className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
            <h2 className="text-3xl font-bold text-blue-400 mb-4 text-center">Why NosPetRegistry?</h2>

            <div className="grid md:grid-cols-3 gap-6 mt-6">
                {/* Nostr Protocol Section */}
                <div className="flex flex-col items-center text-center p-4 bg-gray-700 rounded-lg">
                    {/* Replaced img with Heroicon */}
                    <ShieldCheckIcon className="w-20 h-20 text-blue-400 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-100 mb-2">Decentralized & Secure with Nostr</h3>
                    <p className="text-gray-300 text-sm">
                        NosPetRegistry leverages the power of the Nostr protocol to provide a truly decentralized and censorship-resistant platform for your pet's health records. Your data is owned by you, secured by cryptography, and accessible anywhere without central servers.
                    </p>
                </div>

                {/* Pet Care Importance Section */}
                <div className="flex flex-col items-center text-center p-4 bg-gray-700 rounded-lg">
                    {/* Replaced img with Heroicon */}
                    <HeartIcon className="w-20 h-20 text-red-400 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-100 mb-2">Proactive Pet Care</h3>
                    <p className="text-gray-300 text-sm">
                        Consistent pet care, including timely vaccinations and deworming, is crucial for their well-being and longevity. NosPetRegistry helps you stay organized and never miss an important health milestone.
                    </p>
                </div>

                {/* Importance of Records Section */}
                <div className="flex flex-col items-center text-center p-4 bg-gray-700 rounded-lg">
                    {/* Replaced img with Heroicon */}
                    <ClipboardDocumentListIcon className="w-20 h-20 text-green-400 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-100 mb-2">Vital Health Records at Your Fingertips</h3>
                    <p className="text-gray-300 text-sm">
                        Accurate and accessible health records are essential for veterinarians, pet sitters, and in emergencies. With NosPetRegistry, all your pet's health data is securely stored and easily retrievable, giving you peace of mind.
                    </p>
                </div>
            </div>
        </section>
    );
}

export default AboutNosPetRegistry;