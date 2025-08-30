import React, {createContext, useContext} from 'react';
import {useTripDataProvider} from "./TripDataContext.jsx";
import {useTripActivitiesWebSocket} from "../Hooks/useTripActivitiesWebSocket.js";

const TripActivitiesWsContext = createContext(null);

export function TripActivitiesWsProvider({ tripId, children }) {
    const { tripDays, setTripDays } = useTripDataProvider();
    const activitiesWs = useTripActivitiesWebSocket(tripId, tripDays, setTripDays);

    return (
        <TripActivitiesWsContext.Provider value={activitiesWs}>
            {children}
        </TripActivitiesWsContext.Provider>
    );
}

export function useTripActivitiesWsProvider() {
    const context = useContext(TripActivitiesWsContext);
    if (!context) {
        throw new Error('useTripActivitiesWsProvider must be used within a TripActivitiesWsProvider');
    }
    return context;
}
