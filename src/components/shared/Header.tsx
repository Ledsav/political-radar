import React from 'react';
import {Link, useLocation} from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

const Header: React.FC = () => {
    const location = useLocation();
    const currentPath = location.pathname;

    // Determine the tab value based on the current path, including subroutes
    const currentTab = currentPath.startsWith('/politicians')
        ? '/politicians'
        : currentPath.startsWith('/parties')
            ? '/parties'
            : currentPath.startsWith('/map')
                ? '/map'
                : '/';

    return (
        <AppBar
            position="static"
            color="primary"
            sx={{
                height: '64px',
                border: '1px solid black',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 0,
                boxShadow: 'none',
                backgroundColor: 'secondary.main'
            }}
        >
            <Typography
                variant="h1"
                sx={{paddingLeft: '16px', fontSize: '2.5rem', fontWeight: 'bold'}}
            >
                <Link
                    to="/"
                    style={{textDecoration: 'none', color: 'inherit'}}
                >
                    RADAR POLITICO
                </Link>
            </Typography>
            <Box sx={{marginLeft: 'auto', display: 'flex', height: '100%'}}>
                <Tabs
                    value={currentTab}
                    textColor="inherit"
                    indicatorColor="primary"
                    sx={{
                        height: '100%',
                        '& .MuiTabs-indicator': {
                            display: 'none',
                        },
                        '& .MuiTabs-flexContainer': {
                            height: '100%',
                        },
                        '& .MuiTab-root': {
                            minHeight: '64px',
                            height: '64px',
                            backgroundColor: 'secondary.main',
                            color: 'text.primary',
                            fontSize: '2.5rem',
                            fontWeight: 'bold',
                            border: '1px solid black',
                            '&.Mui-selected': {
                                backgroundColor: 'primary.main',
                                color: 'text.primary',
                            },
                            '&:hover': {
                                backgroundColor: 'primary.main',
                            },
                            '&.Mui-disabled': {
                                backgroundColor: 'secondary.main', // Light gray background when disabled
                                color: 'text.primary',
                            },
                        },
                    }}
                >
                    <Tab label="HOME" value="/" component={Link} to="/"/>
                    <Tab label="POLITICI" value="/politicians" component={Link} to="/politicians"/>
                    <Tab label="PARTITI" value="/parties" component={Link} to="/parties"/>
                    <Tab label="MAPPA" value="/map" component={Link} to="/map"/>
                </Tabs>
            </Box>
        </AppBar>
    );
};

export default Header;
