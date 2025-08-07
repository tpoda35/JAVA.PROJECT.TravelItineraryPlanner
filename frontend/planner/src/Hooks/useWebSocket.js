import {useCallback, useEffect, useRef, useState} from 'react';
import SockJS from 'sockjs-client';
import {Client} from '@stomp/stompjs';
import keycloak from '../keycloak/Keycloak.js';
import keycloakService from "../Services/KeycloakService.js";

const websocketUrl = import.meta.env.VITE_API_WEBSOCKET_URL;

const useWebSocket = () => {
    const stompClientRef = useRef(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const subscriptionsRef = useRef(new Map());

    const connect = useCallback(() => {
        if (stompClientRef.current?.connected || isConnecting) {
            return Promise.resolve(stompClientRef.current);
        }

        return new Promise((resolve, reject) => {
            setIsConnecting(true);

            // Clean up any existing connection first
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
                    console.log(keycloak.token);
                    client.connectHeaders = {
                        Authorization: `Bearer ${keycloak.token}`,
                    };
                },

                onConnect: () => {
                    console.log('[STOMP] Connected');
                    setIsConnected(true);
                    setIsConnecting(false);
                    resolve(client);
                },

                onDisconnect: () => {
                    console.log('[STOMP] Disconnected');
                    setIsConnected(false);
                    setIsConnecting(false);
                    subscriptionsRef.current.clear();
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
            // Unsubscribe from all subscriptions first
            subscriptionsRef.current.forEach((subscription) => {
                subscription.unsubscribe();
            });
            subscriptionsRef.current.clear();

            stompClientRef.current.deactivate();
            stompClientRef.current = null;
            setIsConnected(false);
            console.log('[STOMP] Disconnected');
        }
    }, []);

    const subscribe = useCallback((destination, callback) => {
        if (!stompClientRef.current?.connected) {
            console.warn('[STOMP] Tried to subscribe before connection');
            return null;
        }

        // Check if already subscribed to this destination
        if (subscriptionsRef.current.has(destination)) {
            console.warn(`[STOMP] Already subscribed to ${destination}`);
            return subscriptionsRef.current.get(destination);
        }

        // Subscribe
        const subscription = stompClientRef.current.subscribe(destination, callback);
        subscriptionsRef.current.set(destination, subscription);

        console.log(`[STOMP] Subscribed to ${destination}`);

        // Return unsubscribe function
        return () => {
            subscription.unsubscribe();
            subscriptionsRef.current.delete(destination);
            console.log(`[STOMP] Unsubscribed from ${destination}`);
        };
    }, []);

    const unsubscribe = useCallback((destination) => {
        const subscription = subscriptionsRef.current.get(destination);
        if (subscription) {
            subscription.unsubscribe();
            subscriptionsRef.current.delete(destination);
            console.log(`[STOMP] Unsubscribed from ${destination}`);
        }
    }, []);

    const sendMessage = useCallback((destination, body, headers = {}) => {
        if (stompClientRef.current?.connected) {
            stompClientRef.current.publish({ destination, body, headers });
        } else {
            console.warn('[STOMP] Tried to send message before connection');
        }
    }, []);

    // Cleanup on unmount
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
        client: stompClientRef,
    };
};

export default useWebSocket;