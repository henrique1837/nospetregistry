// src/components/AuthDisplay.jsx
import React from 'react';
import { useNostr } from '../context/NostrContext';
import { PowerIcon, KeyIcon, PuzzlePieceIcon } from '@heroicons/react/24/outline'; // Adding some icons for visual appeal

function AuthDisplay() {
    const { publicKey, loginLocal, loginExtension, logout, isNip07Ready, loginMethod } = useNostr();

    if (!publicKey) {
        return (
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-8 text-center mb-8"> {/* Darker background, border, mb-8 for spacing */}
                <h3 className="text-xl font-bold text-white mb-4 flex items-center justify-center gap-2"> {/* Larger, white heading with icon */}
                    <PowerIcon className="h-6 w-6 text-purple-400" />
                    Connect to Nostr
                </h3>
                <p className="text-gray-300 mb-6 font-medium">Choose your Nostr login method:</p> {/* Lighter gray text */}
                <div className="flex flex-col space-y-4 mb-6"> {/* Increased space-y and mb */}
                    {isNip07Ready ? (
                        <button
                            onClick={() => loginExtension()}
                            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out flex items-center justify-center gap-2 text-lg" // Larger button, icon, text-lg
                        >
                            <PuzzlePieceIcon className="h-6 w-6" />
                            Login with NIP-07 (Browser Extension)
                        </button>
                    ) : (
                        <p className="text-sm text-gray-500 italic p-3 bg-gray-700 border border-gray-600 rounded-lg"> {/* Styled warning for NIP-07 */}
                            <span className="font-semibold text-yellow-400">Warning:</span> NIP-07 extension not detected. Please install Alby or nos2x.
                        </p>
                    )}
                    <button
                        onClick={() => loginLocal()}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out flex items-center justify-center gap-2 text-lg" // Changed to indigo, larger button, icon, text-lg
                    >
                        <KeyIcon className="h-6 w-6" />
                        Login with Local Key (Generate New)
                    </button>
                </div>
                <p className="text-xs text-gray-400 mt-4 max-w-sm mx-auto p-3 bg-gray-700 border border-gray-600 rounded-lg"> {/* Styled info box */}
                    <em className="italic text-gray-300">
                        <span className="font-semibold text-blue-400">Note:</span> A local key is stored only in your browser. This is a demo feature. For better security and wider compatibility, use a NIP-07 browser extension.
                    </em>
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 border-b border-gray-700 pb-4 pt-4"> {/* Adjusted border-b color, added pt-4 */}
            <p className="text-lg text-gray-100 mb-2 md:mb-0"> {/* Adjusted text color, added mb for mobile */}
                Logged in as: <span className="font-mono bg-gray-700 text-green-400 px-3 py-1 rounded-md text-sm break-all">{publicKey.substring(0, 10)}...</span> {/* Darker bg for pubkey, green text */}
                {loginMethod === 'nip07' && <span className="ml-2 bg-purple-900/50 text-purple-300 text-xs px-2 py-1 rounded-full border border-purple-800">NIP-07</span>} {/* Darker badges */}
                {loginMethod === 'local' && <span className="ml-2 bg-indigo-900/50 text-indigo-300 text-xs px-2 py-1 rounded-full border border-indigo-800">Local Key</span>} {/* Darker badges */}
            </p>
            <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white text-md py-2 px-5 rounded-lg transition duration-300 ease-in-out font-semibold" // Larger, bolder logout button
            >
                Logout
            </button>
        </div>
    );
}

export default AuthDisplay;