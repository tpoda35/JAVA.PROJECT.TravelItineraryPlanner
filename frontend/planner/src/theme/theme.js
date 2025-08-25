/**
 * Generates Material-UI theme design tokens based on the provided mode.
 *
 * Provides a complete theme configuration including:
 * - `palette`: colors for background, primary, secondary, success, error, divider, and text
 * - `shape`: global border radius
 * - `typography`: font family
 * - `components`: style overrides for `MuiAppBar`, `MuiDialog`, and `MuiMenu` to remove shadows and paper overlays
 *
 * @param {'light' | 'dark'} mode - The theme mode to generate tokens for
 * @returns {object} Material-UI theme configuration compatible with `createTheme`
 */
export const getDesignTokens = (mode) => ({
    palette: {
        mode,
        ...(mode === 'light'
            ? {
                background: {
                    default: '#f4f6f8',
                    paper: '#ffffff',
                    input: '#f5f5f5',
                },
            }
            : {
                background: {
                    default: '#121212',
                    paper: '#1e1e1e',
                    input: '#434343',
                },
            }),
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#9c27b0',
        },
        success: {
            main: '#4caf50',
        },
        error: {
            main: '#f44336',
        },
        divider: mode === 'light' ? '#e0e0e0' : '#333',
        text: {
            primary: mode === 'light' ? '#000' : '#fff',
            secondary: mode === 'light' ? '#555' : '#aaa',
        },
    },
    shape: {
        borderRadius: 8,
    },
    typography: {
        fontFamily: 'Roboto, sans-serif',
    },
    components: {
        MuiAppBar: {
            styleOverrides: {
                root: {
                    boxShadow: 'none',
                    '&': {
                        '--Paper-overlay': 'none !important',
                    },
                },
            },
        },
        MuiDialog: {
            styleOverrides: {
                paper: {
                    '&': {
                        '--Paper-overlay': 'none !important',
                    },
                },
            },
        },
        MuiMenu: {
            styleOverrides: {
                paper: {
                    '--Paper-overlay': 'none !important',
                },
            },
        }
    }

});
