// src/components/GroupChat.jsx
import React, { useEffect, useState, useCallback, useRef } from 'react'; // Added useRef
import { useNostr, GROUP_CHAT_ID } from '../context/NostrContext';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline'; // Adding a chat icon

function GroupChat({ channelId }) {
    const { publicKey, sendGroupMessage, subscribeToGroupChannel } = useNostr();
    const [groupMessages, setGroupMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null); // Ref for auto-scrolling


    useEffect(() => {
        if (!channelId) {
            setGroupMessages([]);
            return;
        }

        subscribeToGroupChannel(channelId, (event) => { // Capture unsubscribe function
            setGroupMessages(prevMessages => {
                if (!prevMessages.some(msg => msg.id === event.id)) {
                    // Filter out messages that don't have content, if any
                    if (event.content.trim()) {
                        return [...prevMessages, { ...event, sender: event.pubkey }].sort((a, b) => a.created_at - b.created_at);
                    }
                }
                return prevMessages;
            });
        });
        
        return;
    }, [channelId, subscribeToGroupChannel]); // publicKey is not directly used in the filter, so removed


    const handleSendMessage = useCallback(async () => {
        if (newMessage.trim() && publicKey && channelId) {
            await sendGroupMessage(channelId, newMessage);
            setNewMessage('');
            // No need to manually add to messages state here, it will come via subscription
        }
    }, [newMessage, publicKey, channelId, sendGroupMessage]);

    // Format timestamp for display
    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' ' + date.toLocaleDateString();
    };
    
    return (
        <div className="mb-8 w-full max-w-5xl border-t border-gray-700 pt-8"> {/* Consistent section styling */}
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2"> {/* White text, flex for icon */}
                <ChatBubbleLeftRightIcon className="h-6 w-6 text-purple-400" />
                Group Channel: <span className="text-indigo-400 font-mono text-xl">{channelId.substring(0, 10)}...</span> {/* Styled channel ID */}
            </h2>

            <div className="bg-gray-800 border border-gray-700 p-4 rounded-lg h-96 overflow-y-auto mb-4 flex flex-col justify-end"> {/* Dark background, border, fixed height, auto-scroll, flex-col-reverse removed to allow natural scroll-to-bottom */}
                {groupMessages.length === 0 ? (
                    <p className="text-gray-500 text-center italic my-auto">No messages yet in this channel.</p>
                ) : (
                    groupMessages.map((msg, index) => (
                        <div key={msg.id || index} className={`mb-3 p-2 rounded-lg ${msg.pubkey === publicKey ? 'bg-indigo-700 self-end text-right' : 'bg-gray-700 self-start text-left'} max-w-[80%]`}> {/* Styled messages, differentiate sender */}
                            <strong className="text-purple-300 block mb-1">
                                {msg.pubkey === publicKey ? 'You' : `${msg.pubkey.substring(0, 8)}...`}
                            </strong>
                            <p className="text-gray-100 text-base break-words">{msg.content}</p> {/* White text for content, break-words */}
                            <small className="block text-gray-400 text-xs mt-1">
                                {formatTimestamp(msg.created_at)}
                            </small>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} /> {/* Element to scroll into view */}
            </div>

            <div className="flex gap-2">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={publicKey ? "Type your message..." : "Connect to send messages..."}
                    className="flex-grow p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') handleSendMessage();
                    }}
                    disabled={!publicKey} // Disable input if not logged in
                />
                <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || !publicKey} // Disable if not logged in
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-5 rounded-lg transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed" // Larger button
                >
                    Send
                </button>
            </div>
        </div>
    );
}

export default GroupChat;