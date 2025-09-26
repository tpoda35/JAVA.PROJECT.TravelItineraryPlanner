import { Box, Stack, Typography, Collapse, IconButton, Divider } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useState } from "react";

const TripDayItemContent = ({ title, icon, items, renderItem, emptyText, withDivider = true }) => {
    const [open, setOpen] = useState(false);

    return (
        <Box>
            {/* Header */}
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ cursor: "pointer" }}
                onClick={() => setOpen(!open)}
                mb={1}
            >
                <Stack direction="row" alignItems="center" gap={1}>
                    {icon}
                    <Typography variant="subtitle1" fontWeight="bold">
                        {title}
                    </Typography>
                </Stack>
                <IconButton size="small">
                    {open ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                </IconButton>
            </Stack>

            {/* Collapsible content */}
            <Collapse in={open} timeout="auto" unmountOnExit>
                {items && items.length > 0 ? (
                    items.map(renderItem)
                ) : (
                    <Typography color="text.secondary" fontSize=".875rem">
                        {emptyText}
                    </Typography>
                )}
                {withDivider && <Divider sx={{ my: 2 }} />}
            </Collapse>
        </Box>
    );
};

export default TripDayItemContent;
