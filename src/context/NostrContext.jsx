import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { SimplePool } from 'nostr-tools';
import { generateSecretKey, getPublicKey, finalizeEvent, verifyEvent } from 'nostr-tools/pure';


export const APP_NAME = "nospetregistry-v0"
export const GROUP_CHAT_ID = "0cc9446260056b38d29bffff924e9b4a18af81f7d73749d8efd1b4b2d81271da";

const NostrContext = createContext(null);

export const NostrProvider = ({ children }) => {
    const [pool, setPool] = useState(null);
    const [privateKey, setPrivateKey] = useState(null);
    const [publicKey, setPublicKey] = useState(null);
    const [isNip07Ready, setIsNip07Ready] = useState(false);
    const [loginMethod, setLoginMethod] = useState(null);
    const [relays, setRelays] = useState([
        'wss://relay.damus.io',
        'wss://relay.primal.net',
        'wss://nos.lol',
        'wss://relay.snort.social'
    ]);

    const nip07CheckIntervalRef = useRef(null);
    const initialNip07CheckTimeoutRef = useRef(null); // New ref for the initial timeout

    useEffect(() => {
        const newPool = new SimplePool();
        setPool(newPool);

        if (typeof window !== 'undefined') {
            const checkNip07 = () => {
                if (window.nostr) {
                    setIsNip07Ready(true);
                    if (nip07CheckIntervalRef.current) {
                        clearInterval(nip07CheckIntervalRef.current);
                        nip07CheckIntervalRef.current = null; // Clear ref after clearing interval
                    }
                    if (initialNip07CheckTimeoutRef.current) {
                        clearTimeout(initialNip07CheckTimeoutRef.current);
                        initialNip07CheckTimeoutRef.current = null; // Clear ref after clearing timeout
                    }
                    console.log("NIP-07 extension detected and ready.");
                } else {
                    // console.log("Polling for window.nostr...");
                }
            };

            // Start checking after a short delay to give extensions time to inject
            initialNip07CheckTimeoutRef.current = setTimeout(() => { // Store timeout ID in ref
                checkNip07(); // Check immediately after timeout
                // If not found, start polling
                if (!isNip07Ready && !nip07CheckIntervalRef.current) {
                    nip07CheckIntervalRef.current = setInterval(checkNip07, 200);
                }
            }, 500);

        } else {
            console.log("NostrContext: Not in browser, skipping NIP-07 detection.");
        }

        return () => {
            newPool.close([]);
            if (nip07CheckIntervalRef.current) {
                clearInterval(nip07CheckIntervalRef.current);
            }
            if (initialNip07CheckTimeoutRef.current) { // Correctly clear the initial timeout
                clearTimeout(initialNip07CheckTimeoutRef.current);
            }
        };
    }, [isNip07Ready]); // isNip07Ready needs to be a dependency here for the `if (!isNip07Ready)` check in the timeout.

    const loginExtension = useCallback(async () => {
        setLoginMethod('nip07');
        if (typeof window === 'undefined' || !window.nostr || !isNip07Ready) {
            console.error("NIP-07 login attempt: window.nostr not available or extension not ready.");
            setPublicKey(null);
            setLoginMethod(null);
            return;
        }
        try {
            const pubkey = await window.nostr.getPublicKey();
            setPublicKey(pubkey);
            setPrivateKey(null);
            console.log("Logged in with NIP-07 Public Key:", pubkey);
        } catch (error) {
            console.error("NIP-07 login failed:", error);
            if (error instanceof Error && error.message.includes("denied")) {
                alert("NIP-07 request denied by your extension. Please approve the request in your browser extension popup.");
            }
            setPublicKey(null);
            setLoginMethod(null);
        }
    }, [isNip07Ready]);

    const loginLocal = useCallback(() => {
        setLoginMethod('local');
        const sk = generateSecretKey();
        setPrivateKey(sk);
        setPublicKey(getPublicKey(sk));
        console.log("Logged in with Local Public Key:", getPublicKey(sk));
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('nostr_sk');
        setPrivateKey(null);
        setPublicKey(null);
        setLoginMethod(null);
        console.log("Logged out.");
    }, []);

    const publishEvent = useCallback(async (kind, content, tags = []) => {
        if (!publicKey || !pool) {
            console.error("Not logged in or pool not initialized.");
            return null;
        }

        const eventTemplate = {
            kind: kind,
            pubkey: publicKey,
            created_at: Math.floor(Date.now() / 1000),
            tags: tags,
            content: content,
        };

        let signedEvent;
        try {
            if (loginMethod === 'nip07') {
                if (typeof window === 'undefined' || !window.nostr) {
                    console.error("Cannot sign event with NIP-07: Not in browser or extension not available.");
                    return null;
                }
                signedEvent = await window.nostr.signEvent(eventTemplate);
            } else if (loginMethod === 'local' && privateKey) {
                signedEvent = finalizeEvent(eventTemplate, privateKey);
            } else {
                console.error("Cannot sign event: No appropriate login method or private key found.");
                return null;
            }

            await Promise.any(pool.publish(relays, signedEvent));
            return signedEvent;
        } catch (error) {
            console.error("Error publishing event:", error);
            return null;
        }
    }, [privateKey, publicKey, pool, relays, loginMethod]);

    const subscribeToEvents = useCallback(async (filter, onEvent) => {
        if (!pool) {
            console.error("Pool not initialized.");
            return () => {};
        }

        const sub = pool.subscribe(relays, filter,{
            onevent(event) {
                onEvent(event);
            }
        });
        return () => {
            sub.close();
            console.log("Unsubscribed from filter:", filter);
        };
    }, [pool, relays]);

    const sendGroupMessage = useCallback(async (channelId, message) => {
        if (!publicKey) {
            console.error("Cannot send message without public key.");
            return null;
        }
        const tags = [
            ['e', channelId, '', 'root'],
            ['s', 'group-chat']
        ];
        return await publishEvent(42, message, tags);
    }, [publicKey, publishEvent]);

    const subscribeToGroupChannel = useCallback((channelId, onMessage) => {
        const filter = {
            kinds: [42],
            '#e': [channelId],
            '#s': ['group-chat']
        };
        console.log(`Subscribing to group channel with ID: ${channelId}`);
        return subscribeToEvents(filter, onMessage);
    }, [subscribeToEvents]);


    const value = {
        publicKey,
        privateKey,
        loginLocal,
        loginExtension,
        logout,
        publishEvent,
        subscribeToEvents,
        sendGroupMessage,
        subscribeToGroupChannel,
        relays,
        setRelays,
        isNip07Ready,
        loginMethod,
    };

    return <NostrContext.Provider value={value}>{children}</NostrContext.Provider>;
};

export const useNostr = () => {
    const context = useContext(NostrContext);
    if (!context) {
        throw new Error('useNostr must be used within a NostrProvider');
    }
    return context;
};