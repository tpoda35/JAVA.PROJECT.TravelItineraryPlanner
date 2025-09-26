import { useEffect, useState } from "react";
import { IconButton, Tab, Tabs, CircularProgress } from "@mui/material";
import { Close } from "@mui/icons-material";
import InviteTab from "../TripSettingsTabs/InviteTab.jsx";
import MembersTab from "../TripSettingsTabs/MembersTab.jsx";
import RolesTab from "../TripSettingsTabs/RolesTab.jsx";
import { useParams } from "react-router-dom";
import BaseModal from "../../../../../Components/Modal/BaseModal.jsx";
import { useApi } from "../../../../../Hooks/useApi.js";

export default function TripSettingsModal({ open, onClose }) {
    const { tripId } = useParams();
    const { get } = useApi();

    const [tab, setTab] = useState(0);
    const [membersPage, setMembersPage] = useState(null); // store Page object
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);

    const fetchMembers = async (pageNum = 0) => {
        setLoading(true);
        try {
            const res = await get(
                `/trips/${tripId}/collaborators?pageNum=${pageNum}&pageSize=5`
            );
            setMembersPage(res);
            setPage(res.number || 0);
        } catch (err) {
            console.error("Failed to load collaborators:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (open) {
            fetchMembers(0); // load when modal opens
        }
    }, [open]);

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
                    variant: "text",
                },
            ]}
        >
            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
                <Tab label="Invite" />
                <Tab label="Members" />
                <Tab label="Roles" />
            </Tabs>

            {loading ? (
                <CircularProgress />
            ) : (
                <>
                    {tab === 0 && <InviteTab tripId={tripId} />}
                    {tab === 1 && membersPage && (
                        <MembersTab
                            tripId={tripId}
                            membersPage={membersPage}
                            setMembersPage={setMembersPage}
                            currentPage={page}
                        />
                    )}
                    {tab === 2 && membersPage && (
                        <RolesTab
                            tripId={tripId}
                            membersPage={membersPage}
                            setMembersPage={setMembersPage}
                        />
                    )}
                </>
            )}
        </BaseModal>
    );
}
