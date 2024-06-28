import React, {useState} from 'react';
import {Link, useLocation} from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuIcon from '@mui/icons-material/Menu';
import useMediaQuery from '@mui/material/useMediaQuery';
import {useTheme} from '@mui/material/styles';

const Header: React.FC = () => {
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const currentPath = location.pathname;
    const currentTab = currentPath.startsWith('/politicians')
        ? '/politicians'
        : currentPath.startsWith('/parties')
            ? '/parties'
            : currentPath.startsWith('/map')
                ? '/map'
                : '/';

    const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const menuItems = [
        {label: 'HOME', path: '/'},
        {label: 'POLITICI', path: '/politicians'},
        {label: 'PARTITI', path: '/parties'},
        {label: 'MAPPA', path: '/map'},
    ];

    return (
        <AppBar
            position="static"
            color="primary"
            sx={{
                height: {xs: 'auto', sm: '64px'},
                border: '1px solid black',
                display: 'flex',
                flexDirection: {xs: 'column', sm: 'row'},
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 0,
                boxShadow: 'none',
                backgroundColor: 'secondary.main'
            }}
        >
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                padding: '8px'
            }}>
                <Typography
                    variant="h1"
                    sx={{fontSize: {xs: '1.5rem', sm: '2.5rem'}, fontWeight: 'bold'}}
                >
                    <Link to="/" style={{textDecoration: 'none', color: 'inherit'}}>
                        RADAR POLITICO
                    </Link>
                </Typography>
                {isMobile && (
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        onClick={handleMenuClick}
                    >
                        <MenuIcon/>
                    </IconButton>
                )}
            </Box>
            {!isMobile ? (
                <Box sx={{display: 'flex', height: '100%'}}>
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
                                fontSize: {xs: '1rem', sm: '1.2rem', md: '2.5rem'},
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
                                    backgroundColor: 'secondary.main',
                                    color: 'text.primary',
                                },
                            },
                        }}
                    >
                        {menuItems.map((item) => (
                            <Tab
                                key={item.path}
                                label={item.label}
                                value={item.path}
                                component={Link}
                                to={item.path}
                            />
                        ))}
                    </Tabs>
                </Box>
            ) : (
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                >
                    {menuItems.map((item) => (
                        <MenuItem
                            key={item.path}
                            onClick={handleMenuClose}
                            component={Link}
                            to={item.path}
                        >
                            {item.label}
                        </MenuItem>
                    ))}
                </Menu>
            )}
        </AppBar>
    );
};

export default Header;