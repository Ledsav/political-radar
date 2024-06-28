import React from 'react';
import {Link as RouterLink} from 'react-router-dom';
import {useTheme} from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

interface StyledCardProps {
    id: string;
    title: string;
    subtitle: string;
    linkTo: string;
    image: string;
    objectFit?: 'contain' | 'cover';
    objectPosition?: string;
}

const StyledCard: React.FC<StyledCardProps> = ({
                                                   id,
                                                   title,
                                                   subtitle,
                                                   linkTo,
                                                   image,
                                                   objectFit = 'contain',
                                                   objectPosition = 'center'
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
                <CardMedia
                    component="img"
                    height="140"
                    image={image}
                    alt={title}
                    sx={{
                        objectFit: objectFit,
                        objectPosition: objectFit === 'cover' ? objectPosition : 'center',
                        width: '100%',
                        height: '280px',
                        backgroundColor: theme.palette.secondary.main
                    }}
                />
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
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

export default StyledCard;
