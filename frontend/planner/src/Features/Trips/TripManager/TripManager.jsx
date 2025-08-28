import {FolderDataProvider} from "./Contexts/FolderDataContext.jsx";
import {FolderExpansionProvider} from "./Contexts/FolderExpansionContext.jsx";
import {FolderModalsProvider} from "./Contexts/FolderModalsContext.jsx";
import {TripModalsProvider} from "./Contexts/TripModalsContext.jsx";
import {FolderOperationsProvider} from "./Contexts/FolderOperationsContext.jsx";
import {TripOperationsProvider} from "./Contexts/TripOperationsContext.jsx";
import TripManagerContent from "./TripManagerContent.jsx";

export default function TripManager() {
    return (
        <FolderDataProvider>
            <FolderExpansionProvider>
                <FolderModalsProvider>
                    <TripModalsProvider>
                        <FolderOperationsProvider>
                            <TripOperationsProvider>
                                <TripManagerContent />
                            </TripOperationsProvider>
                        </FolderOperationsProvider>
                    </TripModalsProvider>
                </FolderModalsProvider>
            </FolderExpansionProvider>
        </FolderDataProvider>
    );
}

