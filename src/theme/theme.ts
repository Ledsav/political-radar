import {createTheme} from '@mui/material/styles';

const LIME = '#abfb73';
const LIME_SOFT = 'rgba(171, 251, 115, 0.35)';

const theme = createTheme({
    palette: {
        primary: {
            main: '#abfb73',
            light: '#d6fdaa',
            dark: '#7ecf52',
            contrastText: '#000000',
        },
        secondary: {
            main: '#ffffff',
            light: '#ffffff',
            dark: '#666666',
            contrastText: '#000000',
        },
        error: {
            main: '#f44336',
            light: '#e57373',
            dark: '#d32f2f',
            contrastText: '#ffffff',
        },
        warning: {
            main: '#ff9800',
            light: '#ffb74d',
            dark: '#f57c00',
            contrastText: '#000000',
        },
        info: {
            main: '#2196f3',
            light: '#64b5f6',
            dark: '#1976d2',
            contrastText: '#ffffff',
        },
        success: {
            main: '#4caf50',
            light: '#81c784',
            dark: '#388e3c',
            contrastText: '#ffffff',
        },
        text: {
            primary: '#000000',
            secondary: '#555555', // used by MUI for input labels and secondary text
            disabled: '#757575'
        },
        background: {
            default: '#ffffff', // Set the default background color to white
            paper: '#ffffff',
        },
        divider: '#e0e0e0',
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h5: {
            fontWeight: 500,
            color: '#333',
        },
        button: {
            fontFamily: '"Antonio", "Roboto", "Helvetica", "Arial", sans-serif',
            textTransform: 'none',
        },
        h1: {
            fontFamily: '"Antonio", "Roboto", "Helvetica", "Arial", sans-serif',
            fontWeight: 400,
            fontSize: '2.5rem',
        },
        h2: {
            fontFamily: '"Antonio", "Roboto", "Helvetica", "Arial", sans-serif',
            fontWeight: 400,
            fontSize: '2rem',
        },
        // Add more variants if needed
    },
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 0,
                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                    margin: '8px',
                    transition: '0.3s',
                }
            }
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    fontSize: '1rem', // Larger font size for buttons
                    fontWeight: 'bold', // Bold font weight for buttons
                    borderRadius: 0,
                },
                outlined: {
                    borderColor: '#000',
                    color: '#000',
                    '&:hover': {borderColor: '#000', backgroundColor: LIME},
                },
            }
        },

        // Every input shares one look: square corners, 1px black border,
        // 2px when focused, lime for the active/selected state.
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: 0,
                    backgroundColor: '#fff',
                    '& .MuiOutlinedInput-notchedOutline': {borderColor: '#000'},
                    '&:hover .MuiOutlinedInput-notchedOutline': {borderColor: '#000'},
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {borderColor: '#000', borderWidth: 2},
                },
            },
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {color: '#555', '&.Mui-focused': {color: '#000'}},
            },
        },
        MuiPaper: {
            styleOverrides: {
                rounded: {borderRadius: 0},
            },
        },
        MuiMenu: {
            defaultProps: {elevation: 0},
            styleOverrides: {
                paper: {border: '1px solid #000', marginTop: 4},
            },
        },
        MuiMenuItem: {
            styleOverrides: {
                root: {
                    '&:hover, &.Mui-focusVisible': {backgroundColor: LIME_SOFT},
                    '&.Mui-selected, &.Mui-selected:hover': {backgroundColor: LIME, fontWeight: 700},
                },
            },
        },
        MuiAutocomplete: {
            styleOverrides: {
                paper: {borderRadius: 0, border: '1px solid #000', borderTop: 'none', boxShadow: 'none'},
                option: {
                    borderBottom: '1px solid #e0e0e0',
                    '&.Mui-focused, &[aria-selected="true"].Mui-focused': {backgroundColor: `${LIME_SOFT} !important`},
                },
                noOptions: {fontStyle: 'italic'},
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {borderRadius: 0, fontWeight: 500},
                outlined: {borderColor: '#000', '&.MuiChip-clickable:hover': {backgroundColor: LIME_SOFT}},
                filled: {backgroundColor: LIME, border: '1px solid #000', '&.MuiChip-clickable:hover': {backgroundColor: LIME}},
            },
        },
        MuiSwitch: {
            styleOverrides: {
                switchBase: {
                    '&.Mui-checked': {color: '#000'},
                    '&.Mui-checked + .MuiSwitch-track': {backgroundColor: LIME, opacity: 1, border: '1px solid #000'},
                },
                track: {borderRadius: 0, backgroundColor: '#bdbdbd', opacity: 1},
                thumb: {borderRadius: 0, boxShadow: 'none', border: '1px solid #000'},
            },
        },
        MuiPaginationItem: {
            styleOverrides: {
                root: {
                    borderRadius: 0,
                    fontWeight: 700,
                    '&.Mui-selected, &.Mui-selected:hover': {backgroundColor: LIME, border: '1px solid #000'},
                    '&:hover': {backgroundColor: LIME_SOFT},
                },
            },
        },
        MuiTooltip: {
            styleOverrides: {
                tooltip: {borderRadius: 0, backgroundColor: '#000', fontSize: '0.8rem'},
                arrow: {color: '#000'},
            },
        },
    }
});

export default theme;
