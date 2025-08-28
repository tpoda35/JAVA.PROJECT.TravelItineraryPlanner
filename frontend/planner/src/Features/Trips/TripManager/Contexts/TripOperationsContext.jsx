import React, {createContext, useContext} from 'react';
import {useTripOperations} from "../Hooks/useTripOperations.js";

const TripOperationsContext = createContext(null);

export function TripOperationsProvider({ children }) {
    const tripOperations = useTripOperations();

    return (
        <TripOperationsContext.Provider value={tripOperations}>
            {children}
        </TripOperationsContext.Provider>
    );
}

export function useTripOperationsProvider() {
    const context = useContext(TripOperationsContext);
    if (!context) {
        throw new Error('useTripOperationsProvider must be used within a TripOperationsProvider');
    }
    return context;
}
