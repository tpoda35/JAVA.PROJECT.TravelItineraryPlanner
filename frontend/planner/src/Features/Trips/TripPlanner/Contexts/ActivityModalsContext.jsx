import React, {createContext, useContext} from 'react';
import {useActivityModals} from "../Hooks/useActivityModals.js";

const ActivityModalsContext = createContext(null);

export function ActivityModalsProvider({ children }) {
    const activityModals = useActivityModals();

    return (
        <ActivityModalsContext.Provider value={activityModals}>
            {children}
        </ActivityModalsContext.Provider>
    );
}

export function useActivityModalsProvider() {
    const context = useContext(ActivityModalsContext);
    if (!context) {
        throw new Error('useActivityModalsProvider must be used within a ActivityModalsProvider');
    }
    return context;
}
