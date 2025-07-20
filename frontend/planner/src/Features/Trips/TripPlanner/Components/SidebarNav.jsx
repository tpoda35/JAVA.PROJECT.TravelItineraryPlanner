import {Box, List, ListItemButton, ListItemText, Typography} from "@mui/material";

export default function SidebarNav({ sections, activeSection, onClick, buttonRefs, theme }) {
    return (
        <Box
            sx={{
                width: 200,
                p: 2,
                bgcolor: theme.palette.background.paper,
                flexShrink: 0,
                position: "sticky",
                top: 0,
                height: "fit-content",
            }}
        >
            <Typography variant="h6" gutterBottom>
                Navigate
            </Typography>
            <List>
                {sections.map(({ key, label }) => (
                    <ListItemButton
                        key={key}
                        ref={buttonRefs[key]}
                        selected={activeSection === key}
                        onClick={() => onClick(key)}
                        sx={{
                            borderRadius: 1,
                            mb: 0.5,
                            "&.Mui-selected": {
                                bgcolor: theme.palette.primary.main,
                                color: theme.palette.primary.contrastText,
                                "&:hover": {
                                    bgcolor: theme.palette.primary.dark,
                                },
                            },
                        }}
                    >
                        <ListItemText primary={label} />
                    </ListItemButton>
                ))}
            </List>
        </Box>
    );
}
