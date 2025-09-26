import React, {createContext, useContext} from 'react';
import {useAccommodationModals} from "../Hooks/useAccommodationModals.js";

const AccommodationModalsContext = createContext(null);

export function AccommodationModalsProvider({ children }) {
    const accommodationModals = useAccommodationModals();

    return (
        <AccommodationModalsContext.Provider value={accommodationModals}>
            {children}
        </AccommodationModalsContext.Provider>
    );
}

export function useAccommodationModalsProvider() {
    const context = useContext(AccommodationModalsContext);
    if (!context) {
        throw new Error('useAccommodationModalsProvider must be used within a AccommodationModalsProvider');
    }
    return context;
}
