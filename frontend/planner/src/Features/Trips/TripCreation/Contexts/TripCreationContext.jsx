import React, {createContext, useContext} from "react";
import useTripCreation from "../Hooks/useTripCreation.js";

const TripCreationContext = createContext(null);

export function TripCreationProvider({ children }) {
    const tripCreation = useTripCreation();

    return (
        <TripCreationContext.Provider value={tripCreation}>
            {children}
        </TripCreationContext.Provider>
    );
}

export function useTripCreationProvider() {
    const context = useContext(TripCreationContext);
    if (!context) {
        throw new Error("useTripCreationContext must be used within a TripCreationProvider");
    }
    return context;
}
