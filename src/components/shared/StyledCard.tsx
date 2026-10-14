import React from 'react';
import {Link as RouterLink} from 'react-router-dom';
import {useTheme} from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

interface StyledCardProps {
    title: string;
    subtitle: string;
    linkTo: string;
    image?: string | null;
    objectFit?: 'contain' | 'cover';
    objectPosition?: string;
    children?: React.ReactNode;
}

const StyledCard: React.FC<StyledCardProps> = ({
                                                   title,
                                                   subtitle,
                                                   linkTo,
                                                   image,
                                                   objectFit = 'contain',
                                                   objectPosition = 'center',
                                                   children,
                                               }) => {
    const theme = useTheme();

    return (
        <Card sx={{
            margin: '0px',
            borderRadius: 0,
            boxShadow: 'none', // No shadow by default
            border: '1px solid', // Add outline
            borderColor: theme.palette.primary.contrastText, // Use theme divider color
        }}>
            <CardActionArea
                component={RouterLink}
                to={linkTo}
                sx={{
                    '&:hover .MuiCardContent-root': {
                        backgroundColor: theme.palette.primary.main, // Change background color on hover
                        color: theme.palette.primary.contrastText, // Change text color on hover
                    },
                    '&:hover .MuiTypography-root': {
                        color: theme.palette.primary.contrastText, // Change text color on hover
                    }
                }}
            >
                {image ? (
                    <CardMedia
                        component="img"
                        image={image}
                        alt={title}
                        loading="lazy"
                        sx={{
                            objectFit: objectFit,
                            objectPosition: objectFit === 'cover' ? objectPosition : 'center',
                            width: '100%',
                            height: '280px',
                            boxSizing: 'border-box',
                            p: objectFit === 'contain' ? 3 : 0,
                            backgroundColor: theme.palette.secondary.main
                        }}
                    />
                ) : (
                    <Box sx={{
                        height: '280px',
                        display: 'flex',
                        alignItems: 'flex-end',
                        p: 2,
                        backgroundColor: theme.palette.primary.main,
                    }}>
                        <Typography variant="h2" component="span" sx={{fontSize: '2rem', lineHeight: 1.05, overflowWrap: 'anywhere'}}>
                            {title.toUpperCase()}
                        </Typography>
                    </Box>
                )}
                <CardContent
                    sx={{
                        padding: '10px',
                        backgroundColor: '#ffffff',
                        borderTop: '1px solid', // Add top border to separate content from image
                        borderColor: theme.palette.primary.contrastText, // Use theme divider color
                        transition: 'background-color 0.3s, color 0.3s' // Smooth transition for hover effect
                    }}
                >
                    <Typography
                        variant="subtitle1"
                        gutterBottom
                        sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: 2, // Adjust this value to control the number of lines
                            height: '3rem', // Adjust this value based on the number of lines
                            whiteSpace: 'normal',
                            wordBreak: 'break-word',
                            fontWeight: 'bold'
                        }}
                    >
                        {title}
                    </Typography>
                    <Typography
                        variant="body2"
                        color="textPrimary"
                        sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: 1, // Adjust this value to control the number of lines
                            height: '1.5rem', // Adjust this value based on the number of lines
                            whiteSpace: 'normal',
                            wordBreak: 'break-word'
                        }}
                    >
                        {subtitle}
                    </Typography>
                    {children}
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

export default StyledCard;
