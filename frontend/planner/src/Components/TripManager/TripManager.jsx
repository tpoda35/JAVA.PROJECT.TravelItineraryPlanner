import FolderList from "./FolderList.jsx";
import {useEffect, useState} from "react";
import {useApi} from "../../Hooks/useApi.js";

export default function TripManager() {
    const [folders, setFolders] = useState([]);
    const [error, setError] = useState(null);

    const api = useApi();

    useEffect(() => {
        loadFolders();
    }, []);

    const loadFolders = async () => {
        try {
            const data = await api.get('/folders')
            setFolders(data);
        } catch (err) {
            setError('Failed to load folders');
        }
    };

    return (
        <FolderList
            folders={folders}
            expandedFolders={new Set()}
            setExpandedFolders={() => {}}
            onCreateTrip={() => {}}
            onEditTrip={() => {}}
            onDeleteTrip={() => {}}
            onEditFolder={() => {}}
            onDeleteFolder={() => {}}
        />
    )
}