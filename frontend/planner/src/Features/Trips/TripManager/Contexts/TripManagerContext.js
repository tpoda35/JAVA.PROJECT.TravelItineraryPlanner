import { createContext, useContext } from "react";

export const TripManagerContext = createContext(null);

export function useTripManagerContext() {
    const context = useContext(TripManagerContext);
    if (!context) {
        throw new Error("useTripManagerContext must be used within a TripProvider");
    }
    return context;
}
