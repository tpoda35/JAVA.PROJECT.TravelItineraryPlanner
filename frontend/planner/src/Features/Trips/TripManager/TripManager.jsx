import FolderList from "./Components/Folder/FolderList.jsx";
import './TripManager.css';
import LoadingScreen from "../../../Components/LoadingScreen/LoadingScreen.jsx";
import useTripManager from "./Hooks/useTripManager.js";
import TripManagerModals from "./Components/TripManagerModals.jsx";
import {TripContext} from "./Contexts/TripContext.js";

export default function TripManager() {
    // This creates a "singleton" from this.
    const manager = useTripManager();

    if (manager.api.loading) return <LoadingScreen />;

    return (
        // And we are passing it down here, with the same exact data what the top one has.
        <TripContext.Provider value={manager}>
            <div className="trip-manager">
                <div>
                    <button onClick={manager.onCreateFolder}>Create New Folder</button>
                </div>

                <FolderList folders={manager.folders} expandedFolders={manager.expandedFolders} />

                <TripManagerModals/>
            </div>
        </TripContext.Provider>
    );
}
