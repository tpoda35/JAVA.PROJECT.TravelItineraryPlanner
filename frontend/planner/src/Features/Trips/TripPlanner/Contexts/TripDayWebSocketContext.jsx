import React, {createContext, useContext} from 'react';
import {useTripDataProvider} from "./TripDataContext.jsx";
import {useTripDayWebSocket} from "../Hooks/useTripDayWebSocket.js";

const TripDayWsContext = createContext(null);

export function TripDayWsProvider({ tripId, children }) {
    const { tripDays, setTripDays } = useTripDataProvider();
    const tripDayWs = useTripDayWebSocket(tripId, tripDays, setTripDays);

    return (
        <TripDayWsContext.Provider value={tripDayWs}>
            {children}
        </TripDayWsContext.Provider>
    );
}

export function useTripDayWsProvider() {
    const context = useContext(TripDayWsContext);
    if (!context) {
        throw new Error('useTripDayWsProvider must be used within a TripDayWsProvider.');
    }
    return context;
}
