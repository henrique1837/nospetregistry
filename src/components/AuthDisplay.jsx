// src/components/AuthDisplay.jsx
import React, { useState, useMemo } from 'react'; // Added useMemo for nsec encoding
import { useNostr } from '../context/NostrContext';
import * as nip19 from 'nostr-tools/nip19'; // Import nip19 for nsecEncode
import { 
    PowerIcon, KeyIcon, PuzzlePieceIcon,
    EyeIcon, EyeSlashIcon, ClipboardDocumentIcon, CheckIcon, // Icons for private key display
    ExclamationTriangleIcon, LinkIcon // New icons for warnings/links
} from '@heroicons/react/24/outline';

function AuthDisplay() {
    const { publicKey, privateKey, loginLocal, loginExtension, logout, isNip07Ready, loginMethod } = useNostr();
    const [showLocalPrivateKey, setShowLocalPrivateKey] = useState(false); // State to toggle private key visibility
    const [copiedField, setCopiedField] = useState(null); // State for copy button feedback

    // Encode the private key to nsec format, only for local login
    const nsec = useMemo(() => {
        if (loginMethod === 'local' && privateKey) {
            try {
                return nip19.nsecEncode(privateKey);
            } catch (e) {
                console.error("Error encoding private key:", e);
                return '';
            }
        }
        return '';
    }, [loginMethod, privateKey]);

    const handleCopy = (text, field) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    if (!publicKey) {
        return (
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-8 text-center mb-8">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center justify-center gap-2">
                    <PowerIcon className="h-6 w-6 text-purple-400" />
                    Connect to Nostr
                </h3>
                <p className="text-gray-300 mb-6 font-medium">Choose your Nostr login method:</p>
                <div className="flex flex-col space-y-4 mb-6">
                    {isNip07Ready ? (
                        <button
                            onClick={() => loginExtension()}
                            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out flex items-center justify-center gap-2 text-lg"
                        >
                            <PuzzlePieceIcon className="h-6 w-6" />
                            Login with NIP-07 (Browser Extension)
                        </button>
                    ) : (
                        <p className="text-sm text-gray-500 italic p-3 bg-gray-700 border border-gray-600 rounded-lg">
                            <span className="font-semibold text-yellow-400">Warning:</span> NIP-07 extension not detected. Please install Alby or nos2x.
                        </p>
                    )}
                    <button
                        onClick={() => loginLocal()}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out flex items-center justify-center gap-2 text-lg"
                    >
                        <KeyIcon className="h-6 w-6" />
                        Login with Local Key (Generate New)
                    </button>
                </div>
                <p className="text-xs text-gray-400 mt-4 max-w-sm mx-auto p-3 bg-gray-700 border border-gray-600 rounded-lg">
                    <em className="italic text-gray-300">
                        <span className="font-semibold text-blue-400">Note:</span> A local key is stored only in your browser. This is a demo feature. For better security and wider compatibility, use a NIP-07 browser extension.
                    </em>
                </p>
            </div>
        );
    }

    return (
        <div className="mb-8"> {/* Main container for logged in state */}
            {/* Display Public Key and Logout Button */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 border-b border-gray-700 pb-4 pt-4">
                <p className="text-lg text-gray-100 mb-2 md:mb-0">
                    Logged in as: <span className="font-mono bg-gray-700 text-green-400 px-3 py-1 rounded-md text-sm break-all">{publicKey.substring(0, 10)}...</span>
                    {loginMethod === 'nip07' && <span className="ml-2 bg-purple-900/50 text-purple-300 text-xs px-2 py-1 rounded-full border border-purple-800">NIP-07</span>}
                    {loginMethod === 'local' && <span className="ml-2 bg-indigo-900/50 text-indigo-300 text-xs px-2 py-1 rounded-full border border-indigo-800">Local Key</span>}
                </p>
                <button
                    onClick={logout}
                    className="bg-red-600 hover:bg-red-700 text-white text-md py-2 px-5 rounded-lg transition duration-300 ease-in-out font-semibold"
                >
                    Logout
                </button>
            </div>

            {/* --- Private Key Display for Local Login Method --- */}
            {loginMethod === 'local' && (
                <div className="bg-red-900/20 border border-red-900/50 rounded-lg p-6 mb-8 mt-6 animate-fade-in-down">
                    <h4 className="text-xl font-bold text-red-300 mb-4 flex items-center gap-2">
                        <ExclamationTriangleIcon className="h-6 w-6 text-red-400"/>
                        Your Ephemeral Private Key (nsec)
                    </h4>
                    <p className="text-red-300 text-sm mb-4 leading-relaxed">
                        **IMPORTANT: This key gives full control of your Nostr identity and all associated pets and data.**
                        It's currently stored only in your browser. If you clear your browser data or switch devices, you will lose access to this identity.
                    </p>
                    <p className="text-red-300 text-sm mb-4 leading-relaxed">
                        **To keep this profile permanently and use it with other Nostr apps, you MUST save this private key.**
                        Copy it and import it into a secure Nostr client or extension.
                    </p>

                    <div className="mb-6">
                        <label className="block text-xs font-semibold text-red-400 uppercase tracking-wider mb-2">
                            Private Key (nsec) - DO NOT SHARE
                        </label>
                        <div className="flex gap-2 items-center">
                            <div className="flex-1 bg-gray-900 p-3 rounded font-mono text-sm truncate border border-gray-700 relative">
                                <span className={showLocalPrivateKey ? "text-yellow-400" : "text-gray-500 blur-sm select-none"}>
                                    {showLocalPrivateKey ? nsec : "nsec1..................................................."}
                                </span>
                            </div>
                            <button
                                onClick={() => setShowLocalPrivateKey(!showLocalPrivateKey)}
                                className="p-2 bg-gray-700 hover:bg-gray-600 rounded text-gray-300"
                                title={showLocalPrivateKey ? "Hide" : "Show"}
                            >
                                {showLocalPrivateKey ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                            </button>
                            <button
                                onClick={() => handleCopy(nsec, 'nsec')}
                                className="p-2 bg-gray-700 hover:bg-gray-600 rounded text-white"
                                title="Copy Private Key"
                                disabled={!showLocalPrivateKey}
                            >
                                {copiedField === 'nsec' ? <CheckIcon className="h-5 w-5" /> : <ClipboardDocumentIcon className="h-5 w-5" />}
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            If you share this key, others can impersonate you and access your data.
                        </p>
                    </div>

                    <h5 className="text-md font-bold text-red-300 mb-2 flex items-center gap-2">
                        <LinkIcon className="h-5 w-5 text-red-400"/>
                        Recommended Nostr Clients to Save Your Key:
                    </h5>
                    <ul className="list-disc list-inside text-sm text-red-200 space-y-1">
                        <li>
                            <a href="https://github.com/v0l/nos2x" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                                nos2x (Browser Extension)
                            </a> - For desktop browsers.
                        </li>
                        <li>
                            <a href="https://amber.top/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                                Amber (Mobile)
                            </a> - For mobile devices.
                        </li>
                        <li>
                             <a href="https://damus.io/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                                Damus (iOS)
                            </a> - Popular iOS client.
                        </li>
                        <li>
                             <a href="https://primal.net/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                                Primal (Web/Mobile)
                            </a> - Web client with mobile apps.
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
}

export default AuthDisplay;