import React, {createContext, useContext} from 'react';
import {useTripModals} from "../Hooks/useTripModals.js";

const TripModalsContext = createContext(null);

export function TripModalsProvider({ children }) {
    const tripModals = useTripModals();

    return (
        <TripModalsContext.Provider value={tripModals}>
            {children}
        </TripModalsContext.Provider>
    );
}

export function useTripModalsProvider() {
    const context = useContext(TripModalsContext);
    if (!context) {
        throw new Error('useTripModalsProvider must be used within a TripModalsProvider');
    }
    return context;
}
