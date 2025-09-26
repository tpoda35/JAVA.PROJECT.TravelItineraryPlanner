import React, {createContext, useContext} from 'react';
import {useFoodModals} from "../Hooks/useFoodModals.js";

const FoodModalsContext = createContext(null);

export function FoodModalsProvider({ children }) {
    const foodModals = useFoodModals();

    return (
        <FoodModalsContext.Provider value={foodModals}>
            {children}
        </FoodModalsContext.Provider>
    );
}

export function useFoodModalsProvider() {
    const context = useContext(FoodModalsContext);
    if (!context) {
        throw new Error('useFoodModalsProvider must be used within a FoodModalsProvider');
    }
    return context;
}
