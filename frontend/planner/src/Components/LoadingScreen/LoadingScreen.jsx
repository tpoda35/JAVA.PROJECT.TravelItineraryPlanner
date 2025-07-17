import { Box, useTheme } from '@mui/material';

export default function LoadingScreen({ transparent = false, blurred = false }) {
    const theme = useTheme();

    const backgroundColor = transparent
        ? 'transparent'
        : blurred
            ? 'rgba(0, 0, 0, 0.3)'
            : theme.palette.background.paper;

    const backdropStyles = blurred
        ? {
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
        }
        : {};

    return (
        <Box
            sx={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor,
                pointerEvents: 'all',
                zIndex: 100000,
                ...backdropStyles,
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
