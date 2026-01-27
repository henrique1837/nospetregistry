// src/pages/PetLogbookPage.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useNostr, APP_NAME, GROUP_CHAT_ID } from '../context/NostrContext';
import { DocumentTextIcon, CalendarDaysIcon, PlusCircleIcon } from '@heroicons/react/24/outline'; // Adding icons

const KIND_LOGBOOK_ENTRY = 42;

function PetLogbookPage() {
    const { petId } = useParams();
    const { publicKey, subscribeToEvents, publishEvent } = useNostr();
    const [petProfile, setPetProfile] = useState(null);
    const [vaccines, setVaccines] = useState([]);
    const [dewormings, setDewormings] = useState([]);

    const [vaccineDate, setVaccineDate] = useState('');
    const [vaccineType, setVaccineType] = useState('');
    const [vaccineNotes, setVaccineNotes] = useState('');

    const [dewormingDate, setDewormingDate] = useState('');
    const [dewormingType, setDewormingType] = useState('');
    const [dewormingNotes, setDewormingNotes] = useState('');

    const [statusMessage, setStatusMessage] = useState(''); // New state for status/alerts

    // --- Fetch Pet Profile ---
    useEffect(() => {
        if (!petId) return;

        const filter = {
            kinds: [KIND_LOGBOOK_ENTRY],
            ids: [petId],
            '#d': [APP_NAME], // Pet profile events also have this 'd' tag
            '#e': [GROUP_CHAT_ID]
        };

        console.log("Fetching pet profile for ID:", petId);

        // This subscription should ideally be for KIND_PET_PROFILE (e.g., 42) not KIND_LOGBOOK_ENTRY
        // Assuming KIND_LOGBOOK_ENTRY is also 42 from PetList, so this is correct.
        subscribeToEvents(filter, (event) => {
            try {
                const data = JSON.parse(event.content);
                // Ensure ownerPubKey is set, which is the event's pubkey
                setPetProfile({ ...data, id: event.id, ownerPubKey: event.pubkey }); 
            } catch (e) {
                console.error("Error parsing pet profile content for ID:", petId, e);
            }
        });

        return;
    }, [petId, subscribeToEvents]);

    // --- Fetch Logbook Entries ---
    useEffect(() => {
        if (!petId) return;

        const vaccineFilter = {
            kinds: [KIND_LOGBOOK_ENTRY],
            '#d': [`${APP_NAME}_vac`],
            '#I': [petId],
            '#e': [GROUP_CHAT_ID]
        };
        subscribeToEvents(vaccineFilter, (event) => {
            try {
                const data = JSON.parse(event.content);
                setVaccines(prev => [...prev.filter(v => v.id !== event.id), { ...data, id: event.id }]
                    .sort((a, b) => new Date(a.date) - new Date(b.date)));
            } catch (e) {
                console.error("Error parsing vaccine event:", e, event);
            }
        });

        const dewormingFilter = {
            kinds: [KIND_LOGBOOK_ENTRY],
            '#d': [`${APP_NAME}_dew`],
            '#I': [petId],
            '#e': [GROUP_CHAT_ID]
        };
        subscribeToEvents(dewormingFilter, (event) => {
            try {
                const data = JSON.parse(event.content);
                setDewormings(prev => [...prev.filter(d => d.id !== event.id), { ...data, id: event.id }]
                    .sort((a, b) => new Date(a.date) - new Date(b.date)));
            } catch (e) {
                console.error("Error parsing deworming event:", e, event);
            }
        });

        return;
    }, [petId, subscribeToEvents]);

    // --- Handlers for Adding Logbook Entries ---
    const handleAddVaccine = useCallback(async () => {
        if (!publicKey || !petId || !vaccineDate.trim() || !vaccineType.trim()) {
            setStatusMessage("Please provide date and type for the vaccine.");
            return;
        }

        const tags = [
            ['d', `${APP_NAME}_vac`],
            ['c', 'vaccine'],
            ['I', petId],
            ['p', publicKey],
            ['e', GROUP_CHAT_ID, '', 'root']
        ];
        const content = {
            date: vaccineDate.trim(),
            type: vaccineType.trim(),
            notes: vaccineNotes.trim(),
            petId: petId,
            ownerPubKey: publicKey,
            timestamp: Math.floor(Date.now() / 1000)
        };

        const event = await publishEvent(KIND_LOGBOOK_ENTRY, JSON.stringify(content), tags);
        if (event) {
            setStatusMessage("Vaccine record added successfully!");
            setVaccineDate('');
            setVaccineType('');
            setVaccineNotes('');
        } else {
            setStatusMessage("Failed to add vaccine record.");
        }
    }, [publicKey, petId, vaccineDate, vaccineType, vaccineNotes, publishEvent]);

    const handleAddDeworming = useCallback(async () => {
        if (!publicKey || !petId || !dewormingDate.trim() || !dewormingType.trim()) {
            setStatusMessage("Please provide date and type for the deworming.");
            return;
        }

        const tags = [
            ['d', `${APP_NAME}_dew`],
            ['c', 'deworming'],
            ['I', petId],
            ['p', publicKey],
            ['e', GROUP_CHAT_ID, '', 'root']
        ];
        const content = {
            date: dewormingDate.trim(),
            type: dewormingType.trim(),
            notes: dewormingNotes.trim(),
            petId: petId,
            ownerPubKey: publicKey,
            timestamp: Math.floor(Date.now() / 1000)
        };

        const event = await publishEvent(KIND_LOGBOOK_ENTRY, JSON.stringify(content), tags);
        if (event) {
            setStatusMessage("Deworming record added successfully!");
            setDewormingDate('');
            setDewormingType('');
            setDewormingNotes('');
        } else {
            setStatusMessage("Failed to add deworming record.");
        }
    }, [publicKey, petId, dewormingDate, dewormingType, dewormingNotes, publishEvent]);

    if (!petProfile) {
        return (
            <div className="min-h-screen bg-gray-950 flex flex-col items-center py-8 px-4 text-gray-300"> {/* Dark background, light text */}
                <div className="bg-gray-900 p-8 rounded-lg border border-gray-700 w-full max-w-3xl text-center">
                    Loading pet profile or pet not found...
                    <Link to="/" className="text-purple-500 hover:underline block mt-4">← Go to Home</Link>
                </div>
            </div>
        );
    }

    // Determine if the current user is the pet owner
    const isOwner = publicKey && petProfile.ownerPubKey === publicKey;

    return (
        <div className="min-h-screen w-full bg-gray-950 flex flex-col items-center py-8 px-4"> {/* Main page dark background */}
            <div className="bg-gray-900 p-8 rounded-lg border border-gray-700 shadow-xl w-full max-w-3xl text-gray-100"> {/* Dark card for content */}
                <Link to="/" className="text-purple-400 hover:text-purple-300 hover:underline mb-6 block w-fit text-sm flex items-center gap-1">
                    <DocumentTextIcon className="h-4 w-4" /> Back to All Pets
                </Link>

                <h1 className="text-3xl font-bold text-white mb-6 border-b border-gray-700 pb-4">Logbook for <span className="text-indigo-400">{petProfile.name}</span></h1>

                {/* Pet Profile Display */}
                <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 mb-10 p-6 bg-gray-800 rounded-lg border border-gray-700">
                    {petProfile.image && (
                        <img src={petProfile.image} alt={petProfile.name} className="w-64 h-64 object-cover rounded-full shadow-lg border-2 border-purple-500 flex-shrink-0" /> 
                    )}
                    {/* This div will now be centered */}
                    <div className="flex flex-col justify-center items-center md:items-start text-center md:text-left flex-grow"> {/* Added flex, justify-center, items-center (default), and md:items-start, text-center, md:text-left, flex-grow */}
                        <h3 className="text-2xl font-bold text-white mb-2">{petProfile.name}</h3>
                        <p className="text-gray-300 mb-1"><span className="font-semibold text-purple-300">Breed:</span> {petProfile.race}</p>
                        <p className="text-gray-300 mb-1"><span className="font-semibold text-purple-300">Birthday:</span> {petProfile.birthday}</p>
                        <small className="text-gray-400 block mt-2">Owner: {petProfile.ownerPubKey ? petProfile.ownerPubKey.substring(0, 6) + '...' : 'Unknown'}</small>
                    </div>
                </div>

                {statusMessage && (
                    <p className={`text-sm mb-6 p-3 rounded-lg ${statusMessage.includes('Failed') ? 'bg-red-900/50 text-red-300 border border-red-800' : 'bg-green-900/50 text-green-300 border border-green-800'}`}>
                        {statusMessage}
                    </p>
                )}
                
                {/* Add Vaccine Form */}
                {isOwner && (
                    <div className="mb-10 bg-gray-800 p-6 rounded-lg shadow-inner border border-gray-700">
                        <h4 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                            <PlusCircleIcon className="h-5 w-5 text-green-400" /> Add Vaccine Record
                        </h4>
                        <input type="date" value={vaccineDate} onChange={(e) => setVaccineDate(e.target.value)}
                            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 mb-3" placeholder="Date" />
                        <input type="text" value={vaccineType} onChange={(e) => setVaccineType(e.target.value)}
                            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 mb-3" placeholder="Vaccine Type (e.g., Rabies)" />
                        <textarea value={vaccineNotes} onChange={(e) => setVaccineNotes(e.target.value)}
                                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4" placeholder="Notes (optional)"></textarea>
                        <button onClick={handleAddVaccine}
                                className="bg-green-600 hover:bg-green-700 text-white font-bold text-lg py-3 px-5 rounded-lg w-full transition duration-300 ease-in-out">
                            Add Vaccine
                        </button>
                    </div>
                )}

                {/* List Vaccines */}
                <div className="mb-10 border-t border-gray-700 pt-8">
                    <h4 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                        <CalendarDaysIcon className="h-5 w-5 text-blue-400" /> Vaccines:
                    </h4>
                    {vaccines.length === 0 ? (
                        <p className="text-gray-400 italic">No vaccines recorded.</p>
                    ) : (
                        vaccines.map((v) => (
                            <div key={v.id} className="bg-gray-800 p-4 rounded-md mb-3 text-sm border border-gray-700">
                                <strong className="text-purple-300 block mb-1">{v.date}: {v.type}</strong>
                                {v.notes && <p className="text-gray-300 text-base">Notes: {v.notes}</p>}
                            </div>
                        ))
                    )}
                </div>

                {/* Add Deworming Form */}
                {isOwner && (
                    <div className="mb-10 bg-gray-800 p-6 rounded-lg shadow-inner border border-gray-700">
                        <h4 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                            <PlusCircleIcon className="h-5 w-5 text-yellow-400" /> Add Deworming Record
                        </h4>
                        <input type="date" value={dewormingDate} onChange={(e) => setDewormingDate(e.target.value)}
                            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 mb-3" placeholder="Date" />
                        <input type="text" value={dewormingType} onChange={(e) => setDewormingType(e.target.value)}
                            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 mb-3" placeholder="Deworming Type (e.g., Fenbendazole)" />
                        <textarea value={dewormingNotes} onChange={(e) => setDewormingNotes(e.target.value)}
                                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4" placeholder="Notes (optional)"></textarea>
                        <button onClick={handleAddDeworming}
                                className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold text-lg py-3 px-5 rounded-lg w-full transition duration-300 ease-in-out">
                            Add Deworming
                        </button>
                    </div>
                )}

                {/* List Dewormings */}
                <div>
                    <h4 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                        <CalendarDaysIcon className="h-5 w-5 text-orange-400" /> Dewormings:
                    </h4>
                    {dewormings.length === 0 ? (
                        <p className="text-gray-400 italic">No dewormings recorded.</p>
                    ) : (
                        dewormings.map((d) => (
                            <div key={d.id} className="bg-gray-800 p-4 rounded-md mb-3 text-sm border border-gray-700">
                                <strong className="text-purple-300 block mb-1">{d.date}: {d.type}</strong>
                                {d.notes && <p className="text-gray-300 text-base">Notes: {d.notes}</p>}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default PetLogbookPage;