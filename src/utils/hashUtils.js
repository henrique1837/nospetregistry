// src/utils/hashUtils.js

// Function to calculate SHA256 hash of a File object
export async function calculateFileSha256(file) {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const sha256hex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return sha256hex;
}

// Function to get file MIME type from extension or fallback
export function getMimeType(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    switch (ext) {
        case 'jpg':
        case 'jpeg': return 'image/jpeg';
        case 'png': return 'image/png';
        case 'gif': return 'image/gif';
        case 'webp': return 'image/webp';
        case 'mp4': return 'video/mp4';
        case 'webm': return 'video/webm';
        case 'mp3': return 'audio/mpeg';
        case 'wav': return 'audio/wav';
        // Add more as needed
        default: return 'application/octet-stream';
    }
}