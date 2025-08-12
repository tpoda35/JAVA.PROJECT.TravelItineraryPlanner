import React, { createContext, useContext } from 'react';
import useWebSocket from "../Hooks/useWebSocket.js";

const WebSocketContext = createContext(null);

export function WebSocketProvider({ children }) {
    const ws = useWebSocket();

    return (
        <WebSocketContext.Provider value={ws}>
            {children}
        </WebSocketContext.Provider>
    );
}

export function useSharedWebSocket() {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error('useSharedWebSocket must be used within a WebSocketProvider');
    }
    return context;
}
