import { Box, useTheme } from '@mui/material';

/**
 * Fullscreen loading overlay with dual rotating spinners.
 * Can optionally render with a transparent background or a blurred backdrop.
 *
 * @param {boolean} [transparent=false] - If true, removes the background color and shows the content beneath
 * @param {boolean} [blurred=false] - If true, applies a semi-transparent dark overlay with a backdrop blur effect
 * @returns {JSX.Element} A fullscreen loading overlay with animated spinners
 *
 * @example
 * // Default usage with solid background
 * <LoadingScreen />
 *
 * @example
 * // Transparent overlay (spinners only)
 * <LoadingScreen transparent />
 *
 * @example
 * // Blurred backdrop with semi-transparent overlay
 * <LoadingScreen blurred />
 *
 * @example
 * // Both props combined (transparent wins over blurred)
 * <LoadingScreen transparent blurred />
 */

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
