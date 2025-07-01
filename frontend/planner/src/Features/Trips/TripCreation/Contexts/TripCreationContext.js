import { createContext, useContext } from "react";

export const TripCreationContext = createContext(null);

export function useTripCreationContext() {
    const context = useContext(TripCreationContext);
    if (!context) {
        throw new Error("useTripCreationContext must be used within a TripProvider");
    }
    return context;
}
