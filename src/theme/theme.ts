import {createTheme} from '@mui/material/styles';

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
            secondary: '#ffffff',
            disabled: '#bdbdbd'
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
            fontFamily: '"Antonio","Bebas Neue", "Roboto", "Helvetica", "Arial", sans-serif',
            textTransform: 'none',
        },
        h1: {
            fontFamily: '"Antonio","Bebas Neue", "Roboto", "Helvetica", "Arial", sans-serif',
            fontWeight: 400,
            fontSize: '2.5rem',
        },
        h2: {
            fontFamily: '"Antonio","Bebas Neue", "Roboto", "Helvetica", "Arial", sans-serif',
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
                }
            }
        }
    }
});

export default theme;
