import { Box, useTheme } from '@mui/material';

export default function LoadingScreen() {
    const theme = useTheme();

    return (
        <Box
            sx={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: theme.palette.text.primary,
                pointerEvents: 'all',
                zIndex: 100000,
            }}
        >
            <Box
                sx={{
                    width: 50,
                    height: 50,
                    position: 'relative',
                }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        border: '3px solid transparent',
                        borderTopColor: theme.palette.primary.main,
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                    }}
                />
                <Box
                    sx={{
                        position: 'absolute',
                        top: 5,
                        left: 5,
                        right: 5,
                        bottom: 5,
                        border: '3px solid transparent',
                        borderTopColor: theme.palette.secondary.main,
                        borderRadius: '50%',
                        animation: 'spin 1.5s linear infinite',
                    }}
                />
            </Box>

            <style>
                {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
            </style>
        </Box>
    );
}
