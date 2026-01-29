import React from 'react';
import { PlusCircleIcon } from '@heroicons/react/24/outline';

function LogEntryForm({
    type, // 'vaccine' or 'deworming'
    date,
    setDate,
    entryType, // Renamed to avoid conflict with 'type' prop
    setEntryType,
    notes,
    setNotes,
    onAddEntry
}) {
    const isVaccine = type === 'vaccine';
    const title = isVaccine ? 'Add Vaccine Record' : 'Add Deworming Record';
    const placeholderType = isVaccine ? 'Vaccine Type (e.g., Rabies)' : 'Deworming Type (e.g., Fenbendazole)';
    const buttonText = isVaccine ? 'Add Vaccine' : 'Add Deworming';
    const buttonBg = isVaccine ? 'bg-green-600 hover:bg-green-700' : 'bg-yellow-600 hover:bg-yellow-700';
    const iconColor = isVaccine ? 'text-green-400' : 'text-yellow-400';

    return (
        <div className="mb-10 bg-gray-800 p-6 rounded-lg shadow-inner border border-gray-700">
            <h4 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <PlusCircleIcon className={`h-5 w-5 ${iconColor}`} /> {title}
            </h4>
            <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 mb-3"
                placeholder="Date"
            />
            <input
                type="text"
                value={entryType}
                onChange={(e) => setEntryType(e.target.value)}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 mb-3"
                placeholder={placeholderType}
            />
            <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
                placeholder="Notes (optional)"
            ></textarea>
            <button
                onClick={onAddEntry}
                className={`${buttonBg} text-white font-bold text-lg py-3 px-5 rounded-lg w-full transition duration-300 ease-in-out`}
            >
                {buttonText}
            </button>
        </div>
    );
}

export default LogEntryForm;