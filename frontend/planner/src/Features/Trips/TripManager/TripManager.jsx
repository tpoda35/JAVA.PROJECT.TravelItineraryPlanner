import FolderList from "./Components/Folder/FolderList.jsx";
import './TripManager.css';
import LoadingScreen from "../../../Components/LoadingScreen/LoadingScreen.jsx";
import useTripManager from "./Hooks/useTripManager.js";
import TripManagerModals from "./Components/TripManagerModals.jsx";
import {TripManagerContext} from "./Contexts/TripManagerContext.js";
import CustomButton from "../../../Components/Buttons/CustomButton.jsx";

export default function TripManager() {
    // This creates a "singleton" from this.
    const manager = useTripManager();

    if (manager.loading) return <LoadingScreen/>;

    return (
        // And we are passing it down here, with the same exact data what the top one has.
        <TripManagerContext.Provider value={manager}>
            <>
                <div>
                    <CustomButton
                        onClick={manager.onCreateFolder}
                        text="Create New Folder"
                    />
                </div>

                <FolderList folders={manager.folders} expandedFolders={manager.expandedFolders}/>

                <TripManagerModals/>
            </>
        </TripManagerContext.Provider>
    );
}
