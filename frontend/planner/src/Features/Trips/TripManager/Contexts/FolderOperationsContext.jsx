import React, {createContext, useContext} from 'react';
import {useFolderOperations} from "../Hooks/useFolderOperations.js";

const FolderOperationsContext = createContext(null);

export function FolderOperationsProvider({ children }) {
    const folderOperations = useFolderOperations();

    return (
        <FolderOperationsContext.Provider value={folderOperations}>
            {children}
        </FolderOperationsContext.Provider>
    );
}

export function useFolderOperationsProvider() {
    const context = useContext(FolderOperationsContext);
    if (!context) {
        throw new Error('useFolderOperationsProvider must be used within a FolderOperationsProvider');
    }
    return context;
}
