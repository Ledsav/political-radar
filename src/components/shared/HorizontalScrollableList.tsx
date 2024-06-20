import React from 'react';
import {ScrollMenu, VisibilityContext} from 'react-horizontal-scrolling-menu';
import 'react-horizontal-scrolling-menu/dist/styles.css';
import {Box, GlobalStyles, IconButton} from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import {useTheme} from '@mui/material/styles';

interface HorizontalScrollableListProps {
    children: React.ReactNode;
}

const HorizontalScrollableList: React.FC<HorizontalScrollableListProps> = ({children}) => {
    const items = React.Children.toArray(children);
    const theme = useTheme();

    return (
        <>
            <GlobalStyles styles={{
                '::-webkit-scrollbar': {
                    width: '12px',
                    height: '12px',
                },
                '::-webkit-scrollbar-track': {
                    background: 'transparent',
                },
                '::-webkit-scrollbar-thumb': {
                    background: theme.palette.primary.main,
                    borderRadius: '6px',
                },
                '::-webkit-scrollbar-thumb:hover': {
                    background: theme.palette.primary.dark,
                }
            }}/>
            <Box sx={{width: '100%', overflow: 'hidden', position: 'relative'}}>
                <ScrollMenu
                    LeftArrow={LeftArrow}
                    RightArrow={RightArrow}
                >
                    {items.map((child, index) => (
                        <Box
                            key={`element-${index}`}
                            sx={{
                                display: 'inline-block',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {child}
                        </Box>
                    ))}
                </ScrollMenu>
            </Box>
        </>
    );
};

const LeftArrow = () => {
    const {scrollPrev} = React.useContext(VisibilityContext);
    const theme = useTheme();
    return (
        <IconButton
            onClick={() => scrollPrev()}
            sx={{
                position: 'absolute',
                left: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 1,
                backgroundColor: theme.palette.primary.contrastText, // Black background
                color: 'white', // White icon color
                '&:hover': {
                    backgroundColor: 'black', // Keep background black on hover
                },
                '& .MuiSvgIcon-root': {
                    color: 'white', // Ensure the icon is white
                }
            }}
        >
            <ArrowBackIosIcon/>
        </IconButton>
    );
};

const RightArrow = () => {
    const {scrollNext} = React.useContext(VisibilityContext);
    const theme = useTheme();
    return (
        <IconButton
            onClick={() => scrollNext()}
            sx={{
                position: 'absolute',
                right: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 1,
                backgroundColor: theme.palette.primary.contrastText, // Black background
                color: 'white', // White icon color
                '&:hover': {
                    backgroundColor: 'black', // Keep background black on hover
                },
                '& .MuiSvgIcon-root': {
                    color: 'white', // Ensure the icon is white
                }
            }}
        >
            <ArrowForwardIosIcon/>
        </IconButton>
    );
};

export default HorizontalScrollableList;
