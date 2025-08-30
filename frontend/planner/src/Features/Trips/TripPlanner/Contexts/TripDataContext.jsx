import React, { createContext, useContext } from 'react';
import {useTripData} from "../Hooks/useTripData.js";

const TripDataContext = createContext(null);

export function TripDataProvider({ tripId, children }) {
    const tripData = useTripData(tripId);

    return (
        <TripDataContext.Provider value={tripData}>
            {children}
        </TripDataContext.Provider>
    );
}

export function useTripDataProvider() {
    const context = useContext(TripDataContext);
    if (!context) {
        throw new Error('useTripDataProvider must be used within a TripDataProvider');
    }
    return context;
}
