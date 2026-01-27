// src/components/PetRegistrationForm.jsx
import React, { useState, useCallback } from 'react';
import { useNostr, APP_NAME, GROUP_CHAT_ID } from '../context/NostrContext';
import { finalizeEvent } from 'nostr-tools/pure';
import { calculateFileSha256, getMimeType } from '../utils/hashUtils';

const KIND_PET_PROFILE = 42;
const PET_PROFILE_D_TAG_PREFIX = "pet_profile_";

const BLOSSOM_UPLOAD_URL = '/api/blossom/upload'; // <--- CHANGE THIS

function PetRegistrationForm({ onPetRegistered }) {
    const { publicKey, privateKey, loginMethod, publishEvent } = useNostr();
    const [petName, setPetName] = useState('');
    const [petRace, setPetRace] = useState('');
    const [petBirthday, setPetBirthday] = useState('');
    const [petImageFile, setPetImageFile] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState('');
    const [uploadingImage, setUploadingImage] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setPetImageFile(file);
            setImagePreviewUrl(URL.createObjectURL(file));
            setStatusMessage('');
        } else {
            setPetImageFile(null);
            setImagePreviewUrl('');
        }
    };

    const uploadImageToBlossom = useCallback(async () => {
        if (!petImageFile) {
            setStatusMessage('No image file selected for upload.');
            return null;
        }
        if (!publicKey) {
             setStatusMessage('Cannot upload image: Not logged in.');
             return null;
        }
        if (loginMethod === 'local' && !privateKey) {
            setStatusMessage('Cannot upload image: Private key not available for local login method.');
            return null;
        }

        setUploadingImage(true);
        setStatusMessage('Calculating file hash and preparing upload...');

        let sha256hash;
        try {
            sha256hash = await calculateFileSha256(petImageFile);
        } catch (hashError) {
            console.error("Error calculating SHA256:", hashError);
            setStatusMessage(`Failed to calculate image hash: ${hashError.message}`);
            setUploadingImage(false);
            return null;
        }

        const authEventTemplate = {
            kind: 24242,
            pubkey: publicKey,
            created_at: Math.floor(Date.now() / 1000),
            tags: [
                ['t', 'upload'],
                ['x', sha256hash],
            ],
            content: `Upload image: ${petImageFile.name} (SHA256: ${sha256hash})`,
        };

        let signedAuthEvent;
        try {
            if (loginMethod === 'nip07' && window.nostr) {
                signedAuthEvent = await window.nostr.signEvent(authEventTemplate);
            } else if (loginMethod === 'local' && privateKey) {
                signedAuthEvent = finalizeEvent(authEventTemplate, privateKey);
            } else {
                throw new Error("Cannot sign authorization event: No valid login method or private key available.");
            }
        } catch (signError) {
            console.error("Error signing authorization event:", signError);
            setStatusMessage(`Failed to sign upload authorization: ${signError.message}. Please check your login method.`);
            setUploadingImage(false);
            return null;
        }

        const headers = new Headers();
        headers.append('Content-Type', petImageFile.type || 'application/octet-stream');
        headers.append('Authorization', `Nostr ${btoa(JSON.stringify(signedAuthEvent))}`);

        try {
            setStatusMessage('Uploading image to Blossom...');
            const response = await fetch(BLOSSOM_UPLOAD_URL, {
                method: 'PUT',
                headers: headers,
                body: petImageFile,
                mode: 'cors'
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Image upload failed: ${response.status} ${response.statusText} - ${errorText}`);
            }

            const data = await response.json();
            if (data && data.url) {
                setStatusMessage('Image uploaded successfully!');
                return data.url;
            } else {
                throw new Error('Image upload response missing URL or invalid format.');
            }
        } catch (error) {
            console.error('Blossom Image Upload Error:', error);
            setStatusMessage(`Image upload failed: ${error.message}`);
            return null;
        } finally {
            setUploadingImage(false);
        }
    }, [petImageFile, publicKey, privateKey, loginMethod]);

    const handleRegisterPet = useCallback(async () => {
        if (!publicKey) {
            setStatusMessage('You must be logged in to register a pet.');
            return;
        }
        if (!petName.trim() || !petRace.trim() || !petBirthday.trim()) {
            setStatusMessage("Please fill in all pet details (Name, Race, Birthday). Image is optional.");
            return;
        }

        setStatusMessage('Registering pet...');

        let finalImageUrl = '';
        if (petImageFile) {
            finalImageUrl = await uploadImageToBlossom();
            if (!finalImageUrl) {
                setStatusMessage('Failed to upload image. Pet not registered.');
                return;
            }
        }

        const tags = [
            ['d', APP_NAME],
            ['name', petName.trim()],
            ['race', petRace.trim()],
            ['birthday', petBirthday.trim()],
            ...(finalImageUrl ? [['image', finalImageUrl]] : []),
            ['owner', publicKey],
            ['e', GROUP_CHAT_ID, '', 'root']
        ];

        const petContent = {
            name: petName.trim(),
            race: petRace.trim(),
            birthday: petBirthday.trim(),
            image: finalImageUrl,
            ownerPubKey: publicKey,
            timestamp: Math.floor(Date.now() / 1000)
        };

        const event = await publishEvent(KIND_PET_PROFILE, JSON.stringify(petContent), tags);

        if (event) {
            setStatusMessage(`Pet "${petName}" registered successfully!`);
            setPetName('');
            setPetRace('');
            setPetBirthday('');
            setPetImageFile(null);
            setImagePreviewUrl('');
            if (onPetRegistered) {
                onPetRegistered({ ...petContent, id: event.id });
            }
        } else {
            setStatusMessage('Failed to register pet. Check console for details.');
        }
    }, [publicKey, petName, petRace, petBirthday, petImageFile, publishEvent, onPetRegistered, uploadImageToBlossom]);

    if (!publicKey) return null;

    return (
        <div className="mb-8 border-t border-gray-700 pt-8"> {/* Added border-t for separation */}
            <h2 className="text-2xl font-semibold text-white mb-6">Register Your Pet</h2> {/* Changed text color */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6"> {/* Increased gap */}
                <div>
                    <label htmlFor="petName" className="block text-gray-300 text-sm font-bold mb-2">Pet Name:</label>
                    <input
                        type="text"
                        id="petName"
                        value={petName}
                        onChange={(e) => setPetName(e.target.value)}
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="e.g., Fluffy"
                    />
                </div>
                <div>
                    <label htmlFor="petRace" className="block text-gray-300 text-sm font-bold mb-2">Pet Race:</label>
                    <input
                        type="text"
                        id="petRace"
                        value={petRace}
                        onChange={(e) => setPetRace(e.target.value)}
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="e.g., Siamese, Golden Retriever"
                    />
                </div>
                <div>
                    <label htmlFor="petBirthday" className="block text-gray-300 text-sm font-bold mb-2">Pet Birthday:</label>
                    <input
                        type="date"
                        id="petBirthday"
                        value={petBirthday}
                        onChange={(e) => setPetBirthday(e.target.value)}
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                </div>
                <div>
                    <label htmlFor="petImageFile" className="block text-gray-300 text-sm font-bold mb-2">Pet Image (Optional):</label>
                    <input
                        type="file"
                        id="petImageFile"
                        accept="image/*"
                        className="mt-1 block w-full text-sm text-gray-300
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border-0
                            file:text-sm file:font-semibold
                            file:bg-purple-600 file:text-white
                            hover:file:bg-purple-700 cursor-pointer" // Adjusted file input style
                        onChange={handleFileChange}
                    />
                    {imagePreviewUrl && (
                        <div className="mt-4 p-4 bg-gray-800 rounded-lg border border-gray-700"> {/* Styled preview container */}
                            <p className="text-sm font-medium text-gray-300 mb-2">Image Preview:</p>
                            <img src={imagePreviewUrl} alt="Pet Preview" className="mt-2 w-full max-h-48 object-cover rounded-lg shadow-md" /> {/* Added object-cover and max-h */}
                        </div>
                    )}
                </div>
            </div>
            {statusMessage && (
                <p className={`text-sm mb-4 ${statusMessage.includes('Failed') ? 'text-red-400' : 'text-green-400'}`}>
                    {statusMessage}
                </p>
            )}
            <button
                onClick={handleRegisterPet}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out w-full text-lg" // Larger button
                disabled={uploadingImage}
            >
                {uploadingImage ? 'Uploading Image...' : 'Register Pet'}
            </button>
        </div>
    );
}

export default PetRegistrationForm;