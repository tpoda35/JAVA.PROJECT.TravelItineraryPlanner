import {useState} from "react";
import {IconButton, Tab, Tabs} from "@mui/material";
import {Close} from "@mui/icons-material";
import InviteTab from "../TripSettingsTabs/InviteTab.jsx";
import MembersTab from "../TripSettingsTabs/MembersTab.jsx";
import RolesTab from "../TripSettingsTabs/RolesTab.jsx";
import {useParams} from "react-router-dom";
import BaseModal from "../../../../../Components/Modal/BaseModal.jsx";

export default function TripSettingsModal({ open, onClose }) {
    const { tripId } = useParams();
    const [tab, setTab] = useState(0);

    return (
        <BaseModal
            open={open}
            onClose={onClose}
            title={
                <>
                    Trip Settings
                    <IconButton
                        onClick={onClose}
                        sx={{ position: "absolute", right: 8, top: 8 }}
                    >
                        <Close />
                    </IconButton>
                </>
            }
            actions={[
                {
                    label: "Close",
                    onClick: onClose,
                    variant: "text"
                }
            ]}
        >
            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
                <Tab label="Invite" />
                <Tab label="Members" />
                <Tab label="Roles" />
            </Tabs>

            {tab === 0 && <InviteTab tripId={tripId} />}
            {tab === 1 && <MembersTab tripId={tripId} />}
            {tab === 2 && <RolesTab tripId={tripId} />}
        </BaseModal>
    );
}
