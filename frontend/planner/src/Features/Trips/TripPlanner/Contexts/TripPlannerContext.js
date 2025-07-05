import { createContext, useContext } from "react";

export const TripPlannerContext = createContext(null);

export function useTripPlannerContext() {
    const context = useContext(TripPlannerContext);
    if (!context) {
        throw new Error("useTripPlannerContext must be used within a TripProvider");
    }
    return context;
}
