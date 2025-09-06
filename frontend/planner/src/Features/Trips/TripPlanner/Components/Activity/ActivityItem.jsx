import {memo, useCallback, useEffect, useRef, useState} from "react";
import formatTime from "../../../../../Utils/formatTime.js";
import {Box, IconButton, TextField, Typography, useTheme,} from "@mui/material";
import DatePicker from "react-datepicker";
import DeleteIcon from "@mui/icons-material/Delete";
import ActivityDeleteModal from "../Modals/ActivityDeleteModal.jsx";
import {useEditableField} from "../../Hooks/useEditableField.js";
import {useParams} from "react-router-dom";
import {useSharedWebSocket} from "../../../../../Contexts/WebSocketContext.jsx";
import {useActivityModalsProvider} from "../../Contexts/ActivityModalsContext.jsx";

const activityItem = ({ tripDayActivity, dayId }) => {
    const theme = useTheme();
    const { tripId } = useParams();
    const { sendMessage } = useSharedWebSocket();
    const { onDeleteActivity } = useActivityModalsProvider();

    const [editingDateField, setEditingDateField] = useState(null);

    const inputRefs = {
        startDate: useRef(null),
        endDate: useRef(null),
    };

    const calendarRefs = {
        startDate: useRef(null),
        endDate: useRef(null),
    };

    const handleUpdate = useCallback((updatedActivity, type) => {
        const payload = {
            type,
            entityId: updatedActivity.id,
            activity: updatedActivity,
        };

        sendMessage(
            `/app/trips/${tripId}/days/${dayId}`,
            JSON.stringify(payload)
        );
    }, [tripId, dayId]);

    // Title editing
    const titleEditor = useEditableField(
        tripDayActivity.title,
        (newTitle) => handleUpdate(
            { ...tripDayActivity, title: newTitle },
            "ACTIVITY_UPDATED_TITLE"
        )
    );

    // Description editing
    const descriptionEditor = useEditableField(
        tripDayActivity.description,
        (newDescription) => handleUpdate(
            { ...tripDayActivity, description: newDescription },
            "ACTIVITY_UPDATED_DESCRIPTION"
        )
    );

    // Handle clicking outside for date pickers
    useEffect(() => {
        const handleClickOutside = (event) => {
            const inputEl = inputRefs[editingDateField]?.current;
            const calendarEl = calendarRefs[editingDateField]?.current;

            if (
                inputEl &&
                !inputEl.contains(event.target) &&
                (!calendarEl || !calendarEl.contains(event.target))
            ) {
                setEditingDateField(null);
            }
        };

        if (editingDateField) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [editingDateField]);

    const handleDateChange = async (newDate) => {
        if (editingDateField && newDate && newDate !== tripDayActivity[editingDateField]) {
            const typeMap = {
                startDate: "ACTIVITY_UPDATED_START_DATE",
                endDate: "ACTIVITY_UPDATED_END_DATE"
            };
            await handleUpdate(
                { ...tripDayActivity, [editingDateField]: newDate },
                typeMap[editingDateField]
            );
        }
        setEditingDateField(null);
    };

    return (
        <>
            <ActivityDeleteModal dayId={dayId} />
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
                    aria-label="delete tripDayActivity"
                    title="Delete tripDayActivity"
                    color="error"
                    sx={{ position: "absolute", top: 8, right: 8 }}
                    onClick={() => {
                        onDeleteActivity(tripDayActivity.id);
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
                            onClick={() => setEditingDateField("startDate")}
                        >
                            {formatTime(tripDayActivity.startDate)}
                        </Typography>

                        {editingDateField === "startDate" && (
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
                                    selected={new Date(tripDayActivity.startDate)}
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
                            onClick={() => setEditingDateField("endDate")}
                        >
                            {formatTime(tripDayActivity.endDate)}
                        </Typography>

                        {editingDateField === "endDate" && (
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
                                    selected={new Date(tripDayActivity.endDate)}
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
                    onClick={titleEditor.startEditing}
                >
                    {titleEditor.isEditing ? (
                        <TextField
                            variant="standard"
                            size="small"
                            autoFocus
                            fullWidth
                            value={titleEditor.editValue}
                            onChange={(e) => titleEditor.setEditValue(e.target.value)}
                            onKeyDown={titleEditor.handleKeyDown}
                            onBlur={titleEditor.handleBlur}
                        />
                    ) : (
                        tripDayActivity.title || "Click to add title..."
                    )}
                </Typography>

                {/* Description */}
                {descriptionEditor.isEditing ? (
                    <TextField
                        variant="standard"
                        size="small"
                        autoFocus
                        fullWidth
                        multiline
                        value={descriptionEditor.editValue}
                        onChange={(e) => descriptionEditor.setEditValue(e.target.value)}
                        onKeyDown={descriptionEditor.handleKeyDown}
                        onBlur={descriptionEditor.handleBlur}
                        sx={{ mt: 1 }}
                    />
                ) : (
                    (
                        <Typography
                            variant="body2"
                            sx={{ cursor: "pointer", mt: 1 }}
                            onClick={descriptionEditor.startEditing}
                        >
                            {tripDayActivity.description || "Click to add description..."}
                        </Typography>
                    )
                )}
            </Box>
        </>
    );
}

export default memo(activityItem);