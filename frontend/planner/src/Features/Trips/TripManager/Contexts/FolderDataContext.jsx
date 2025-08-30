import React, { createContext, useContext } from 'react';
import {useFolderData} from "../Hooks/useFolderData.js";

const FolderDataContext = createContext(null);

export function FolderDataProvider({ children }) {
    const folderData = useFolderData()

    return (
        <FolderDataContext.Provider value={folderData}>
            {children}
        </FolderDataContext.Provider>
    );
}

export function useFolderDataProvider() {
    const context = useContext(FolderDataContext);
    if (!context) {
        throw new Error('useFolderDataProvider must be used within a FolderDataProvider');
    }
    return context;
}
