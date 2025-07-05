import './FolderList.css'
import FolderItem from "./FolderItem.jsx";

export default function FolderList({
                                       folders,
                                       expandedFolders
                                   })
{
    if (!folders || folders.length === 0) {
        return (
            <div className="folder-list-empty">
                <div className="empty-icon">📁</div>
                <h3>No folders yet</h3>
                <p>Create your first folder to organize your trips</p>
            </div>
        );
    }

    return (
        <div className="folder-list">
            {folders.map(folder => {
                const isExpanded = expandedFolders.has(folder.id);
                const tripCount = folder.trips ? folder.trips.length : 0;

                return (
                    <FolderItem
                        key={folder.id}
                        folder={folder}
                        isExpanded={isExpanded}
                        tripCount={tripCount}
                    />
                );
            })}
        </div>
    );
}