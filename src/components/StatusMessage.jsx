import React from 'react';

function StatusMessage({ message }) {
    if (!message) return null;

    const isError = message.includes('Failed');
    const bgColor = isError ? 'bg-red-900/50' : 'bg-green-900/50';
    const textColor = isError ? 'text-red-300' : 'text-green-300';
    const borderColor = isError ? 'border-red-800' : 'border-green-800';

    return (
        <p className={`text-sm mb-6 p-3 rounded-lg ${bgColor} ${textColor} border ${borderColor}`}>
            {message}
        </p>
    );
}

export default StatusMessage;