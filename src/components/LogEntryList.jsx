import React from 'react';
import { CalendarDaysIcon } from '@heroicons/react/24/outline';

function LogEntryList({ type, entries }) {
    const isVaccine = type === 'vaccine';
    const title = isVaccine ? 'Vaccines:' : 'Dewormings:';
    const iconColor = isVaccine ? 'text-blue-400' : 'text-orange-400';

    return (
        <div className="border-t border-gray-700 pt-8">
            <h4 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <CalendarDaysIcon className={`h-5 w-5 ${iconColor}`} /> {title}
            </h4>
            {entries.length === 0 ? (
                <p className="text-gray-400 italic">No {type}s recorded.</p>
            ) : (
                entries.map((entry) => (
                    <div key={entry.id} className="bg-gray-800 p-4 rounded-md mb-3 text-sm border border-gray-700">
                        <strong className="text-purple-300 block mb-1">{entry.date}: {entry.type}</strong>
                        {
                            entry.notes &&
                            <>
                            <p className="text-gray-300 text-base">Notes</p>
                            <div style={{ whiteSpace: 'pre-wrap' }}>
                                {entry.notes}
                            </div>
                            </>
                        }
                    </div>
                ))
            )}
        </div>
    );
}

export default LogEntryList;