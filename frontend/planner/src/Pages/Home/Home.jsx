import {Box, Button, Stack, Typography} from "@mui/material";

export default function Home() {
    return(
        <>
            <Box
                sx={{
                    textAlign: 'center',
                    py: 6,
                    px: 2,
                }}
            >
                <Typography
                    variant="h2"
                    sx={{
                        fontFamily: '"Bebas Neue", sans-serif',
                        fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
                        mb: 2
                    }}
                >
                    Dream. Plan. Explore.
                </Typography>

                <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 600, mx: 'auto' }}>
                    Organize flights, hotels & activities in seconds.
                    <br />
                    Invite friends to collaborate, vote on ideas, and build your dream itinerary as a team.
                </Typography>
            </Box>


            <Stack direction="column" spacing={2} alignItems="center">
                <Button variant="contained" size="large">
                    Start planning now
                </Button>
                <Button variant="outlined" size="large">
                    Learn more
                </Button>
            </Stack>
        </>
    )
}