import {useCallback, useEffect, useRef, useState} from "react";
import formatTime from "../../../../Utils/formatTime.js";
import {Box, IconButton, TextField, Typography, useTheme,} from "@mui/material";
import DatePicker from "react-datepicker";
import DeleteIcon from "@mui/icons-material/Delete";
import {useTripPlannerContext} from "../Contexts/TripPlannerContext.js";
import ActivityDeleteModal from "./ActivityDeleteModal.jsx";

export default function ActivityItem({ activity, dayId }) {
    const theme = useTheme();
    const { sendMessage, tripId, setShowActivityDeleteModal, setActivityToDelete } = useTripPlannerContext();
    const [editingField, setEditingField] = useState(null);
    const [editValue, setEditValue] = useState("");

    const inputRefs = {
        startDate: useRef(null),
        endDate: useRef(null),
        text: useRef(null),
    };

    const calendarRefs = {
        startDate: useRef(null),
        endDate: useRef(null),
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            let inputEl;
            if (editingField === "title" || editingField === "description") {
                inputEl = inputRefs.text.current;
            } else {
                inputEl = inputRefs[editingField]?.current;
            }

            const calendarEl = calendarRefs[editingField]?.current;

            if (
                inputEl &&
                !inputEl.contains(event.target) &&
                (!calendarEl || !calendarEl.contains(event.target))
            ) {
                setEditingField(null);
            }
        };

        if (editingField) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [editingField]);

    const getUpdatedPayloadType = (field) => {
        switch (field) {
            case "title":
                return "ACTIVITY_UPDATED_TITLE";
            case "description":
                return "ACTIVITY_UPDATED_DESCRIPTION";
            case "startDate":
                return "ACTIVITY_UPDATED_START_DATE";
            case "endDate":
                return "ACTIVITY_UPDATED_END_DATE";
            default:
                return null;
        }
    };

    const handleKeyDown = async (e) => {
        if (e.key === "Enter") {
            if (editValue !== activity[editingField]) {
                const type = getUpdatedPayloadType(editingField);
                await handleUpdate({ ...activity, [editingField]: editValue }, type);
            }
            setEditingField(null);
        } else if (e.key === "Escape") {
            setEditingField(null);
        }
    };

    const handleDateChange = async (newDate) => {
        if (editingField && newDate && newDate !== activity[editingField]) {
            const type = getUpdatedPayloadType(editingField);
            await handleUpdate({ ...activity, [editingField]: newDate }, type);
        }
        setEditingField(null);
    };

    const handleUpdate = useCallback((updatedActivity, type) => {
        const payload = {
            type,
            activityId: updatedActivity.id,
            activityDetailsDtoV3: updatedActivity,
        };

        sendMessage(
            `/app/trips/${tripId}/days/${dayId}/activities`,
            JSON.stringify(payload)
        );
    }, [tripId, dayId, sendMessage]);

    return (
        <>
            <ActivityDeleteModal dayId={dayId}/>
            <Box
                mb={2}
                p={2}
                sx={{
                    backgroundColor: "background.paper",
                    borderRadius: 1,
                    position: "relative",
                }}
            >
                {/* Delete Button */}
                <IconButton
                    aria-label="delete activity"
                    title="Delete activity"
                    color="error"
                    sx={{ position: "absolute", top: 8, right: 8 }}
                    onClick={() => {
                        setActivityToDelete(activity.id)
                        setShowActivityDeleteModal(true)
                    }}
                >
                    <DeleteIcon />
                </IconButton>

                {/* Start and End Time */}
                <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 1 }}>
                    <Box position="relative" ref={inputRefs.startDate}>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ cursor: "pointer" }}
                            onClick={() => setEditingField("startDate")}
                        >
                            {formatTime(activity.startDate)}
                        </Typography>

                        {editingField === "startDate" && (
                            <Box
                                ref={calendarRefs.startDate}
                                sx={{
                                    position: "absolute",
                                    zIndex: 10,
                                    top: "100%",
                                    left: 0,
                                    mt: 1,
                                    boxShadow: theme.shadows[5],
                                    borderRadius: 1,
                                    backgroundColor: theme.palette.background.paper,
                                }}
                            >
                                <DatePicker
                                    selected={new Date(activity.startDate)}
                                    onChange={(date) => handleDateChange(date)}
                                    showTimeSelect
                                    showTimeSelectOnly
                                    timeIntervals={15}
                                    timeFormat="HH:mm"
                                    inline
                                />
                            </Box>
                        )}
                    </Box>

                    <Typography variant="body2" color="text.secondary">
                        –
                    </Typography>

                    <Box position="relative" ref={inputRefs.endDate}>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ cursor: "pointer" }}
                            onClick={() => setEditingField("endDate")}
                        >
                            {formatTime(activity.endDate)}
                        </Typography>

                        {editingField === "endDate" && (
                            <Box
                                ref={calendarRefs.endDate}
                                sx={{
                                    position: "absolute",
                                    zIndex: 10,
                                    top: "100%",
                                    left: 0,
                                    mt: 1,
                                    boxShadow: theme.shadows[5],
                                    borderRadius: 1,
                                    backgroundColor: theme.palette.background.paper,
                                }}
                            >
                                <DatePicker
                                    selected={new Date(activity.endDate)}
                                    onChange={(date) => handleDateChange(date)}
                                    showTimeSelect
                                    showTimeSelectOnly
                                    timeIntervals={15}
                                    timeFormat="HH:mm"
                                    inline
                                />
                            </Box>
                        )}
                    </Box>
                </Box>

                {/* Title */}
                <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    sx={{ cursor: "pointer" }}
                    onClick={() => {
                        setEditingField("title");
                        setEditValue(activity.title || "");
                    }}
                >
                    {editingField === "title" ? (
                        <TextField
                            inputRef={inputRefs.text}
                            variant="standard"
                            size="small"
                            autoFocus
                            fullWidth
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                    ) : (
                        activity.title
                    )}
                </Typography>

                {/* Description */}
                {editingField === "description" ? (
                    <TextField
                        inputRef={inputRefs.text}
                        variant="standard"
                        size="small"
                        autoFocus
                        fullWidth
                        multiline
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        sx={{ mt: 1 }}
                    />
                ) : (
                    activity.description && (
                        <Typography
                            variant="body2"
                            sx={{ cursor: "pointer", mt: 1 }}
                            onClick={() => {
                                setEditingField("description");
                                setEditValue(activity.description);
                            }}
                        >
                            {activity.description}
                        </Typography>
                    )
                )}
            </Box>
        </>
    );
}
