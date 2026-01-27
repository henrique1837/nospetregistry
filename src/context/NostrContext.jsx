import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { SimplePool } from 'nostr-tools';
import { generateSecretKey, getPublicKey, finalizeEvent, verifyEvent } from 'nostr-tools/pure';
import { init as initNostrLogin, launch as launchNostrLoginDialog, logout as logoutNostrLogin } from 'nostr-login'; // Import nostr-login functions

export const APP_NAME = "nospetregistry-v0";
export const GROUP_CHAT_ID = "0cc9446260056b38d29bffff924e9b4a18af81f7d73749d8efd1b4b2d81271da";

const NostrContext = createContext(null);

export const NostrProvider = ({ children }) => {
    const [pool, setPool] = useState(null);
    const [privateKey, setPrivateKey] = useState(null);
    const [publicKey, setPublicKey] = useState(null);
    // isNip07Ready becomes less critical as nostr-login manages window.nostr availability internally
    // You might still keep it if you have other logic depending on raw NIP-07 extension presence.
    const [isNip07Ready, setIsNip07Ready] = useState(false); // Can potentially be removed or managed differently
    const [loginMethod, setLoginMethod] = useState(null);
    const [relays, setRelays] = useState([
        'wss://relay.damus.io',
        'wss://relay.primal.net',
        'wss://nos.lol',
        'wss://relay.snort.social'
    ]);

    // Refactored useEffect for pool initialization and nostr-login setup
    useEffect(() => {
        const newPool = new SimplePool();
        setPool(newPool);

        if (typeof window !== 'undefined') {
            // Initialize nostr-login
            initNostrLogin({
                // You can pass options here, e.g., for theme, bunkers, etc.
                // These correspond to the data- attributes in the script tag documentation.
                // For example:
                // theme: 'ocean',
                // bunkers: 'nsec.app,highlighter.com',
                // perms: 'sign_event:1'
            });

            // Listen for nostr-login authentication events
            const handleAuth = (e) => {
                console.log(e)
                if (e.detail.type === 'login') {
                    // When nostr-login successfully logs in, it populates window.nostr
                    // We can then get the public key from there.
                    if (window.nostr) {
                        window.nostr.getPublicKey().then(pubkey => {
                            setPublicKey(pubkey);
                            setPrivateKey(null); // nostr-login handles the private key securely
                            setLoginMethod('nostr-login'); // Indicate login via nostr-login
                            setIsNip07Ready(true); // Since window.nostr is now effectively "ready"
                            console.log("Logged in via nostr-login with Public Key:", pubkey);
                        }).catch(err => {
                            console.error("Failed to get public key after nostr-login success:", err);
                            setPublicKey(null);
                        });
                    }
                }  else if(e.detail.type === 'signup'){
                    alert(e.detail.localNsec)
                    const pubkey = e.detail.pubkey;
                    const nsec = e.detail.localNsec;
                    setPublicKey(pubkey);
                    setPrivateKey(nsec);
                    setLoginMethod('nostr-login');

                } else if (e.detail.type === 'logout') {
                    // Handle logout initiated by nostr-login UI
                    //document.dispatchEvent(new Event("nlLogout"));
                }
            };

            document.addEventListener('nlAuth', handleAuth);

            // You might still want a basic check if an extension is present initially for UI hints
            // but nostr-login will manage the actual window.nostr provider.
            // Simplified NIP-07 check (less critical now)
            if (window.nostr) {
                setIsNip07Ready(true);
            }


        } else {
            console.log("NostrContext: Not in browser, skipping nostr-login initialization.");
        }

        return;
    }, []); // Empty dependency array to run once on mount

    // Removed the previous nip07CheckIntervalRef and initialNip07CheckTimeoutRef logic

    // Simplified loginExtension, or replace with a dedicated nostr-login launch
    const loginNostrLogin = useCallback(async (startScreen = 'welcome') => {
        // You can launch specific screens of nostr-login
        // This effectively replaces your previous "loginExtension" since nostr-login handles
        // both NIP-07 extensions and NIP-46 connects.
        launchNostrLoginDialog({ startScreen });
        // The actual state update (setPublicKey, setLoginMethod) will happen in the nlAuth event listener
    }, []);


    const loginLocal = useCallback(() => {
        setLoginMethod('local');
        const sk = generateSecretKey();
        setPrivateKey(sk);
        setPublicKey(getPublicKey(sk));
        console.log("Logged in with Local Public Key:", getPublicKey(sk));
    }, []);

    const handleLogout = useCallback(() => { // Renamed to avoid clash if you also use logoutNostrLogin directly
        localStorage.removeItem('nostr_sk'); // If you store local keys
        setPrivateKey(null);
        setPublicKey(null);
        setLoginMethod(null);
        // Also trigger nostr-login's internal logout
        logoutNostrLogin();
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
            // Now, window.nostr is managed by nostr-login, so it's always the primary way
            // to sign for 'nostr-login' method.
            if (loginMethod === 'nostr-login') {
                if (typeof window === 'undefined' || !window.nostr) {
                    console.error("Cannot sign event with nostr-login: Not in browser or window.nostr not available.");
                    return null;
                }
                signedEvent = await window.nostr.signEvent(eventTemplate);
            } else if (loginMethod === 'local' && privateKey) {
                signedEvent = finalizeEvent(eventTemplate, privateKey);
            } else {
                console.error("Cannot sign event: No appropriate login method or private key found.");
                return null;
            }

            // Using Promise.any for pool.publish is good
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
        loginNostrLogin, // New function to launch nostr-login dialog
        logout: handleLogout, // Use the unified logout handler
        publishEvent,
        subscribeToEvents,
        sendGroupMessage,
        subscribeToGroupChannel,
        relays,
        setRelays,
        isNip07Ready, // Can be used to conditionally show UI, but nostr-login abstracts a lot
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