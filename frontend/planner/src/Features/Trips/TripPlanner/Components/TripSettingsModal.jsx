import {useState} from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Tab, Tabs,} from "@mui/material";
import {Close} from "@mui/icons-material";
import InviteTab from "./InviteTab.jsx";
import MembersTab from "./MembersTab.jsx";
import RolesTab from "./RolesTab.jsx";

export default function TripSettingsModal({ open, onClose, tripId }) {
    const [tab, setTab] = useState(0);

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>
                Trip Settings
                <IconButton
                    onClick={onClose}
                    sx={{ position: "absolute", right: 8, top: 8 }}
                >
                    <Close />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers>
                <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
                    <Tab label="Invite" />
                    <Tab label="Members" />
                    <Tab label="Roles" />
                </Tabs>

                {tab === 0 && <InviteTab tripId={tripId} />}
                {tab === 1 && <MembersTab tripId={tripId} />}
                {tab === 2 && <RolesTab tripId={tripId} />}
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
}
