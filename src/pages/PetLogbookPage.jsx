import React, { useEffect, useState, useCallback, useMemo } from 'react'; // Added useMemo
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { usePageTitle } from '../hooks/usePageTitle';

import { useNostr, APP_NAME, GROUP_CHAT_ID } from '../context/NostrContext';
import {
    DocumentTextIcon, // For "All Records" or "Vaccines"
    CalendarDaysIcon, // For "Dewormings"
    ClipboardDocumentListIcon // New icon for "All Records"
} from '@heroicons/react/24/outline';

// Import existing components
import PetProfileHeader from '../components/PetProfileHeader';
import StatusMessage from '../components/StatusMessage';
import LogEntryForm from '../components/LogEntryForm';
import LogEntryList from '../components/LogEntryList';

const KIND_LOGBOOK_ENTRY = 42;

function PetLogbookPage() {
    const { petId } = useParams();
    const { publicKey, subscribeToEvents, publishEvent } = useNostr();
    const [petProfile, setPetProfile] = useState(null);
    const [vaccines, setVaccines] = useState([]);
    const [dewormings, setDewormings] = useState([]);

    // State for vaccine form
    const [vaccineDate, setVaccineDate] = useState('');
    const [vaccineType, setVaccineType] = useState('');
    const [vaccineNotes, setVaccineNotes] = useState('');

    // State for deworming form
    const [dewormingDate, setDewormingDate] = useState('');
    const [dewormingType, setDewormingType] = useState('');
    const [dewormingNotes, setDewormingNotes] = useState('');

    const [statusMessage, setStatusMessage] = useState('');
    const [activeTab, setActiveTab] = useState('all'); // Default to 'all' records tab

    // --- Fetch Pet Profile ---
    useEffect(() => {
        if (!petId) return;

        const filter = {
            kinds: [KIND_LOGBOOK_ENTRY],
            ids: [petId],
            '#d': [APP_NAME],
            '#e': [GROUP_CHAT_ID]
        };

        console.log("Fetching pet profile for ID:", petId);

        subscribeToEvents(filter, (event) => {
            try {
                const data = JSON.parse(event.content);
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

    // --- Memoized combined log entries for "All Records" tab ---
    const allLogEntries = useMemo(() => {
        const combined = [...vaccines.map(v => ({ ...v, category: 'vaccine' })),
                          ...dewormings.map(d => ({ ...d, category: 'deworming' }))];
        return combined.sort((a, b) => new Date(a.date) - new Date(b.date));
    }, [vaccines, dewormings]);

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
        usePageTitle('Loading Pet Logbook...')

        return (
            <div className="min-h-screen bg-gray-950 flex flex-col items-center py-8 px-4 text-gray-300">
                <Helmet>
                    <title>Loading Pet Logbook...</title>
                    <meta name="description" content="Loading pet's health logbook details." />
                </Helmet>
                <div className="bg-gray-900 p-8 rounded-lg border border-gray-700 w-full max-w-3xl text-center">
                    Loading pet profile or pet not found...
                    <Link to="/" className="text-purple-500 hover:underline block mt-4">← Go to Home</Link>
                </div>
            </div>
        );
    }

    const isOwner = publicKey && petProfile.ownerPubKey === publicKey;
    usePageTitle(`${petProfile.name}'s Logbook - Nostr Pet Care`)
    const pageTitle = `${petProfile.name}'s Logbook - Nostr Pet Care`;
    const pageDescription = `Health logbook for ${petProfile.name}, a ${petProfile.race || 'pet'} born on ${petProfile.birthday ? new Date(petProfile.birthday).toLocaleDateString() : 'an unknown date'}. View vaccines, dewormings, and more on Nostr Pet Care.`;
    const ogTitle = `${petProfile.name}'s Health Logbook on Nostr Pet Care`;
    const ogDescription = `View ${petProfile.name}'s comprehensive health records, including vaccines, dewormings, and medical history. Powered by Nostr.`;
    const petImage = petProfile.image || null;
    const currentUrl = `https://nospetregistry.vercel.app/#/pet/${petProfile.id}`;

    return (
        <div className="min-h-screen w-full bg-gray-950 flex flex-col items-center py-8 px-4">
            <Helmet>
                <title>{pageTitle}</title>
                <meta name="description" content={pageDescription} />
                <meta name="keywords" content={`Nostr, pet care, pet health, ${petProfile.name}, ${petProfile.race}, logbook, vaccines, deworming`} />
                <link rel="canonical" href={currentUrl} />
                <meta property="og:url" content={currentUrl} />
                <meta property="og:type" content="article" />
                <meta property="og:title" content={ogTitle} />
                <meta property="og:description" content={ogDescription} />
                <meta property="og:image" content={petImage} />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta property="og:locale" content="en_US" />
                <meta property="og:site_name" content="NosPetRegistry" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@nos_pet1273" />
                <meta name="twitter:creator" content="@nos_pet1273" />
                <meta name="twitter:title" content={ogTitle} />
                <meta name="twitter:description" content={ogDescription} />
                <meta name="twitter:image" content={petImage} />
                <meta name="twitter:image:alt" content={`Profile image of ${petProfile.name}, a ${petProfile.race}`} />
            </Helmet>

            <div className="bg-gray-900 p-8 rounded-lg border border-gray-700 shadow-xl w-full max-w-3xl text-gray-100">
                <PetProfileHeader petProfile={petProfile} />

                <StatusMessage message={statusMessage} />

                {/* Tabs for All Records, Vaccines, and Dewormings */}
                <div className="flex flex-wrap justify-center gap-2 mb-8"> 
                    <button
                        className={`flex-1 min-w-[120px] sm:flex-none py-2 px-4 rounded-lg text-lg font-semibold transition duration-300 ease-in-out flex items-center justify-center gap-2
                            ${activeTab === 'all' ? 'bg-purple-600 text-white shadow-lg' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                        onClick={() => setActiveTab('all')}
                    >
                        <ClipboardDocumentListIcon className="h-5 w-5" /> <span className="hidden sm:inline">All </span>Records
                    </button>
                    <button
                        className={`flex-1 min-w-[120px] sm:flex-none py-2 px-4 rounded-lg text-lg font-semibold transition duration-300 ease-in-out flex items-center justify-center gap-2
                            ${activeTab === 'vaccines' ? 'bg-purple-600 text-white shadow-lg' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                        onClick={() => setActiveTab('vaccines')}
                    >
                        <DocumentTextIcon className="h-5 w-5" /> Vaccines
                    </button>
                    <button
                        className={`flex-1 min-w-[120px] sm:flex-none py-2 px-4 rounded-lg text-lg font-semibold transition duration-300 ease-in-out flex items-center justify-center gap-2
                            ${activeTab === 'dewormings' ? 'bg-purple-600 text-white shadow-lg' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                        onClick={() => setActiveTab('dewormings')}
                    >
                        <CalendarDaysIcon className="h-5 w-5" /> Dewormings
                    </button>
                </div>

                {/* Tab Content */}
                {activeTab === 'all' && (
                    <LogEntryList type="all" entries={allLogEntries} />
                )}

                {activeTab === 'vaccines' && (
                    <>
                        {isOwner && ( // Conditional rendering for owner
                            <LogEntryForm
                                type="vaccine"
                                date={vaccineDate}
                                setDate={setVaccineDate}
                                entryType={vaccineType}
                                setEntryType={setVaccineType}
                                notes={vaccineNotes}
                                setNotes={setVaccineNotes}
                                onAddEntry={handleAddVaccine}
                            />
                        )}
                        <LogEntryList type="vaccine" entries={vaccines} />
                    </>
                )}

                {activeTab === 'dewormings' && (
                    <>
                        {isOwner && ( // Conditional rendering for owner
                            <LogEntryForm
                                type="deworming"
                                date={dewormingDate}
                                setDate={setDewormingDate}
                                entryType={dewormingType}
                                setEntryType={setDewormingType}
                                notes={dewormingNotes}
                                setNotes={setDewormingNotes}
                                onAddEntry={handleAddDeworming}
                            />
                        )}
                        <LogEntryList type="deworming" entries={dewormings} />
                    </>
                )}
            </div>
        </div>
    );
}

export default PetLogbookPage;