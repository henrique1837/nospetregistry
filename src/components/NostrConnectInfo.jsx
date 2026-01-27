// src/components/NostrConnectInfo.jsx
import React, { useState, useMemo } from 'react';
import * as nip19 from 'nostr-tools/nip19';
import { 
    QuestionMarkCircleIcon, 
    ClipboardDocumentIcon, 
    CheckIcon,
    ArrowTopRightOnSquareIcon,
    UserCircleIcon 
} from '@heroicons/react/24/outline';

// No TypeScript interface needed in plain JavaScript

const NostrConnectInfo = ({ publicKey }) => { // Removed React.FC and interface
    if(!publicKey) return;
    const [copiedField, setCopiedField] = useState(null);

    // Encode Public Key to npub format
    const npub = useMemo(() => {
        try {
            return nip19.npubEncode(publicKey);
        } catch (e) {
            console.error("Error encoding public key:", e);
            return '';
        }
    }, [publicKey]);

    const handleCopy = (text, field) => { // Removed type annotations
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    if (!publicKey) {
        return (
            <div className="mt-8 text-center text-white-500">
                Connect to Nostr to see your identity information.
            </div>
        );
    }

    return (
        <div className="mt-8 border-t border-gray-700 pt-8">
            {/* --- EDUCATIONAL HEADER --- */}
            <div className="bg-blue-900/30 border border-blue-800 rounded-lg p-6 mb-6">
                <div className="flex items-start gap-4">
                    <div className="bg-blue-900 p-2 rounded-full hidden md:block">
                        <QuestionMarkCircleIcon className="h-6 w-6 text-blue-300" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white mb-2">Your Nostr Identity</h3>
                        <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                            You're connected via Nostr! Your public identity below allows you to interact with this app and the broader Nostr network. 
                            This identity is portable and works across many Nostr-compatible applications.
                        </p>
                        <a 
                            href="https://nostr.com/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-sm font-semibold text-blue-400 hover:text-blue-300"
                        >
                            Learn more about Nostr <ArrowTopRightOnSquareIcon className="h-4 w-4 ml-1" />
                        </a>
                    </div>
                </div>
            </div>

            {/* --- Public ID (npub) --- */}
            <div className="mb-6 bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                    <UserCircleIcon className="h-5 w-5 text-indigo-400"/>
                    Your Public Nostr ID
                </h4>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Public ID (npub)
                </label>
                <div className="flex gap-2">
                    <code className="flex-1 bg-gray-900 p-3 rounded text-indigo-400 font-mono text-sm truncate border border-gray-700">
                        {npub}
                    </code>
                    <button 
                        onClick={() => handleCopy(npub, 'npub')}
                        className="p-2 bg-gray-700 hover:bg-gray-600 rounded text-white"
                        title="Copy Public Key"
                    >
                        {copiedField === 'npub' ? <CheckIcon className="h-5 w-5" /> : <ClipboardDocumentIcon className="h-5 w-5" />}
                    </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                    This is your public identifier on the Nostr network. Share this with others so they can follow you.
                </p>
            </div>

            {/* --- View External Profile --- */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
                <p className="text-gray-400 text-sm">
                    See your Nostr profile on a popular web client:
                </p>
                <a 
                    href={`https://snort.social/p/${npub}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium transition-colors text-sm"
                >
                    View on Snort.social <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                </a>
            </div>
        </div>
    );
};

export default NostrConnectInfo;