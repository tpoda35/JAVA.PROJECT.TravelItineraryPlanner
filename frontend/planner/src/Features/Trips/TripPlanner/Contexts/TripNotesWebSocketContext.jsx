import React, {createContext, useContext} from 'react';
import {useTripDataProvider} from "./TripDataContext.jsx";
import useTripNotesWebSocket from "../Hooks/useTripNotesWebSocket.js";

const TripNotesWsContext = createContext(null);

export function TripNotesWsProvider({ tripId, children }) {
    const { setTripNotes } = useTripDataProvider();
    const notesWs = useTripNotesWebSocket(tripId, setTripNotes);

    return (
        <TripNotesWsContext.Provider value={notesWs}>
            {children}
        </TripNotesWsContext.Provider>
    );
}

export function useTripNotesWsProvider() {
    const context = useContext(TripNotesWsContext);
    if (!context) {
        throw new Error('useTripNotesWsProvider must be used within a TripNotesWsProvider');
    }
    return context;
}
