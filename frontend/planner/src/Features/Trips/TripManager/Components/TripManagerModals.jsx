import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Typography
} from '@mui/material';
import { useTripManagerContext } from '../Contexts/TripManagerContext';

export default function TripManagerModals() {
    const props = useTripManagerContext();

    const handleClose = (setter) => {
        setter(false);
        props.setError(null);
    };

    return (
        <>
            {/* Trip Delete Modal */}
            <Dialog open={props.showTripDeleteModal} onClose={() => handleClose(props.setShowTripDeleteModal)} disableScrollLock>
                <DialogTitle>Delete Trip</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleClose(props.setShowTripDeleteModal)}>Cancel</Button>
                    <Button onClick={props.handleDeleteTrip} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Trip Rename Modal */}
            <Dialog open={props.showTripRenameModal} onClose={() => handleClose(props.setShowTripRenameModal)} disableScrollLock>
                <DialogTitle>Rename Trip</DialogTitle>
                <DialogContent>
                    <TextField
                        label="New Trip Name"
                        value={props.newTripName}
                        onChange={(e) => {
                            props.setNewTripName(e.target.value);
                            props.setError(null);
                        }}
                        error={Boolean(props.error)}
                        helperText={props.error}
                        fullWidth
                        autoFocus
                        margin="dense"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleClose(props.setShowTripRenameModal)}>Cancel</Button>
                    <Button onClick={props.handleRenameTrip} color="primary" variant="contained">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Folder Rename Modal */}
            <Dialog open={props.showFolderRenameModal} onClose={() => handleClose(props.setShowFolderRenameModal)} disableScrollLock>
                <DialogTitle>Rename Folder</DialogTitle>
                <DialogContent>
                    <TextField
                        label="New Folder Name"
                        value={props.newFolderName}
                        onChange={(e) => {
                            props.setNewFolderName(e.target.value);
                            props.setError(null);
                        }}
                        error={Boolean(props.error)}
                        helperText={props.error}
                        fullWidth
                        autoFocus
                        margin="dense"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleClose(props.setShowFolderRenameModal)}>Cancel</Button>
                    <Button onClick={props.handleRenameFolder} color="primary" variant="contained">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Folder Create Modal */}
            <Dialog open={props.showFolderCreateModal} onClose={() => handleClose(props.setShowFolderCreateModal)} disableScrollLock>
                <DialogTitle>Create Folder</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Folder Name"
                        value={props.folderName}
                        onChange={(e) => {
                            props.setFolderName(e.target.value);
                            props.setError(null);
                        }}
                        error={Boolean(props.error)}
                        helperText={props.error}
                        fullWidth
                        autoFocus
                        margin="dense"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleClose(props.setShowFolderCreateModal)}>Cancel</Button>
                    <Button onClick={props.handleCreateFolder} color="primary" variant="contained">
                        Create
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Folder Delete Modal */}
            <Dialog open={props.showFolderDeleteModal} onClose={() => handleClose(props.setShowFolderDeleteModal)} disableScrollLock>
                <DialogTitle>Delete Folder</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure? All trips in this folder will be deleted.</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleClose(props.setShowFolderDeleteModal)}>Cancel</Button>
                    <Button onClick={props.handleDeleteFolder} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
