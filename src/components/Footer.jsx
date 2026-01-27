// src/components/Footer.jsx
import React from 'react';
import { GlobeAltIcon } from '@heroicons/react/24/solid'; // Using GlobeAltIcon for Nostr profile
import { CodeBracketIcon } from '@heroicons/react/24/solid'; // Using CodeBracketIcon for GitHub

// You'll need to define these constants or pass them as props
// For demonstration, I'll put placeholders. In a real app,
// these might come from environment variables or a config file.
const NOSTR_PROJECT_PROFILE_NIP_05 = "nostr@example.com"; // Replace with your project's NIP-05 or public key
const NOSTR_PROJECT_PROFILE_LINK = "https://snort.social/p/npubxxxxxxxxxxxxxxxxx"; // Replace with a link to your project's Nostr profile on a client
const GITHUB_REPO_LINK = "https://github.com/your-org/nos-pet-registry"; // Replace with your GitHub repo link

function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 border-t border-gray-700 p-6 w-full text-gray-400 text-sm mt-12">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">

                {/* Copyright Information */}
                <p>&copy; {currentYear} NosPetRegistry. All rights reserved.</p>

                {/* Social/Project Links */}
                <div className="flex space-x-6">
                    <a
                        href={NOSTR_PROJECT_PROFILE_LINK}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
                        title="Nostr Project Profile"
                    >
                        <GlobeAltIcon className="h-5 w-5" />
                        Nostr
                        {/* Optionally, you could display the NIP-05 here: */}
                        {/* <span className="hidden md:inline-block"> ({NOSTR_PROJECT_PROFILE_NIP_05})</span> */}
                    </a>

                    <a
                        href={GITHUB_REPO_LINK}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                        title="GitHub Repository"
                    >
                        <CodeBracketIcon className="h-5 w-5" />
                        GitHub
                    </a>
                </div>

            </div>
        </footer>
    );
}

export default Footer;