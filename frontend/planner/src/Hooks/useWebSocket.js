import { useCallback, useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import keycloak from '../keycloak/Keycloak.js';
import keycloakService from "../Services/KeycloakService.js";

const websocketUrl = import.meta.env.VITE_API_WEBSOCKET_URL;
const tokenRefreshThreshold = Number(import.meta.env.VITE_TOKEN_REFRESH_THRESHOLD_SECONDS);

const useWebSocket = () => {
    const stompClientRef = useRef(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [connectionId, setConnectionId] = useState(0); // New state to track connections

    // Store { callback, headers, subscription } by destination for resubscribe
    const subscriptionsRef = useRef(new Map());

    const connect = useCallback(() => {
        if (stompClientRef.current?.connected || isConnecting) {
            return Promise.resolve(stompClientRef.current);
        }

        return new Promise((resolve, reject) => {
            setIsConnecting(true);

            if (stompClientRef.current) {
                stompClientRef.current.deactivate();
            }

            const socket = new SockJS(websocketUrl);

            const client = new Client({
                webSocketFactory: () => socket,
                debug: (str) => console.log('[STOMP DEBUG]', str),
                reconnectDelay: 5000,

                beforeConnect: async () => {
                    await keycloakService.updateToken();
                    client.connectHeaders = {
                        Authorization: `Bearer ${keycloak.token}`,
                    };
                },

                onConnect: () => {
                    // console.log('[STOMP] Connected');
                    setIsConnected(true);
                    setIsConnecting(false);
                    setConnectionId((prev) => prev + 1); // Increment connectionId on each connect

                    // Resubscribe to all saved subscriptions
                    subscriptionsRef.current.forEach((subData, destination) => {
                        const newSub = client.subscribe(destination, subData.callback, subData.headers || {});
                        subscriptionsRef.current.set(destination, {
                            ...subData,
                            subscription: newSub,
                        });
                        console.log(`[STOMP] Resubscribed to ${destination}`);
                    });

                    resolve(client);
                },

                onDisconnect: () => {
                    // console.log('[STOMP] Disconnected');
                    setIsConnected(false);
                    setIsConnecting(false);
                    // Keep subscriptions for resubscribe on reconnect
                },

                onStompError: (frame) => {
                    console.error('[STOMP] Error:', frame.headers['message']);
                    console.error('Details:', frame.body);
                    setIsConnecting(false);
                    reject(new Error(frame.headers['message'] || 'STOMP connection error'));
                },
            });

            stompClientRef.current = client;
            client.activate();
        });
    }, [isConnecting]);

    const disconnect = useCallback(() => {
        if (stompClientRef.current) {
            subscriptionsRef.current.forEach(({ subscription }) => {
                subscription.unsubscribe();
            });
            subscriptionsRef.current.clear();

            stompClientRef.current.deactivate();
            stompClientRef.current = null;
            setIsConnected(false);
            // console.log('[STOMP] Disconnected');
        }
    }, []);

    const subscribe = useCallback((destination, callback, headers = {}) => {
        if (!stompClientRef.current?.connected) {
            console.warn('[STOMP] Tried to subscribe before connection');
            return null;
        }

        if (subscriptionsRef.current.has(destination)) {
            console.warn(`[STOMP] Already subscribed to ${destination}`);
            return subscriptionsRef.current.get(destination).unsubscribe;
        }

        const subscription = stompClientRef.current.subscribe(destination, callback, headers);
        subscriptionsRef.current.set(destination, { callback, headers, subscription });

        console.log(`[STOMP] Subscribed to ${destination}`);

        // Return unsubscribe function
        return () => {
            subscription.unsubscribe();
            subscriptionsRef.current.delete(destination);
            // console.log(`[STOMP] Unsubscribed from ${destination}`);
        };
    }, []);

    const unsubscribe = useCallback((destination) => {
        const subData = subscriptionsRef.current.get(destination);
        if (subData) {
            subData.subscription.unsubscribe();
            subscriptionsRef.current.delete(destination);
            // console.log(`[STOMP] Unsubscribed from ${destination}`);
        }
    }, []);

    const sendMessage = useCallback((destination, body, headers = {}) => {
        if (stompClientRef.current?.connected) {
            stompClientRef.current.publish({ destination, body, headers });
        } else {
            console.warn('[STOMP] Tried to send message before connection');
        }
    }, []);

    useEffect(() => {
        const deactivateClient = () => {
            if (!stompClientRef.current || !stompClientRef.current.active) {
                return Promise.resolve();
            }

            return new Promise((resolve) => {
                let resolved = false;

                const client = stompClientRef.current;
                const originalOnDisconnect = client.onDisconnect;

                client.onDisconnect = () => {
                    if (!resolved) {
                        resolved = true;
                        setIsConnected(false);
                        setIsConnecting(false);
                        resolve();
                    }
                    if (originalOnDisconnect) originalOnDisconnect();
                };

                client.deactivate();

                setTimeout(() => {
                    if (!resolved) {
                        resolved = true;
                        resolve();
                    }
                }, 3000);
            });
        };

        const refreshAndReconnect = async () => {
            try {
                const token = await keycloakService.updateToken(tokenRefreshThreshold);
                console.log('Token after update:', token);

                await deactivateClient();
                await connect();
            } catch (err) {
                console.error('Error refreshing token or reconnecting WS:', err);
            }
        };

        const interval = setInterval(async () => {
            if (!keycloak.token) return;

            const exp = keycloak.tokenParsed?.exp;
            if (!exp) return;

            const now = Math.floor(Date.now() / 1000);
            const timeLeft = exp - now;

            if (timeLeft < tokenRefreshThreshold) {
                await refreshAndReconnect();
            }
        }, 30 * 1000);

        return () => clearInterval(interval);
    }, [connect]);

    useEffect(() => {
        return () => {
            disconnect();
        };
    }, [disconnect]);

    return {
        connect,
        disconnect,
        subscribe,
        unsubscribe,
        sendMessage,
        isConnected,
        isConnecting,
        connectionId,  // export connectionId here
        client: stompClientRef,
    };
};

export default useWebSocket;
