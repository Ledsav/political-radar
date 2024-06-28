import React from 'react';
import {Box, Tooltip, Typography, useMediaQuery} from '@mui/material';
import InfoIcon from "@mui/icons-material/Info";

interface CredibilityScoreProps {
    score: number;
    label: string;
}

const ScoreTooltip: React.FC<{ score: number; label: string; explanation: string }> = ({
                                                                                           score,
                                                                                           label,
                                                                                           explanation
                                                                                       }) => (
    <Tooltip title={explanation} arrow>
        <Box sx={{display: 'flex', alignItems: 'center', mb: 2}}>
            <ScoreBox score={score} label={label}/>
            <InfoIcon sx={{ml: 1, cursor: 'pointer'}}/>
        </Box>
    </Tooltip>
);

const ScoreBox: React.FC<CredibilityScoreProps> = ({score, label}) => {
    const isMobile = useMediaQuery('(max-width:600px)');

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'stretch',
                width: '100%',
                maxWidth: isMobile ? '100%' : '400px',
                height: isMobile ? '100px' : '150px',
                position: 'relative',
                margin: '10px',
            }}
        >
            <Box
                sx={{
                    width: isMobile ? '15%' : '10%',
                    backgroundColor: 'black',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                }}
            >
                <Typography
                    sx={{
                        color: 'white',
                        transform: 'rotate(-90deg)',
                        whiteSpace: 'nowrap',
                        position: 'absolute',
                        fontSize: isMobile ? '0.8rem' : '1.2rem',
                        fontWeight: 'regular',
                        left: isMobile ? '-20px' : '-10px',
                        width: '100px',  // Fixed width for consistency
                        textAlign: 'center',
                    }}
                >
                    {label}
                </Typography>
            </Box>
            <Box
                sx={{
                    flex: 1,
                    backgroundColor: 'black',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    paddingRight: isMobile ? '20px' : '50px',
                }}
            >
                <Typography
                    variant="h2"
                    component="div"
                    sx={{
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: isMobile ? '3rem' : '6rem',
                        lineHeight: 1,
                        display: 'flex',
                        alignItems: 'baseline',
                    }}
                >
                    {score}
                    <Typography
                        variant="h2"
                        component="span"
                        sx={{
                            fontSize: isMobile ? '1rem' : '2rem',
                            fontWeight: 'regular',
                            marginLeft: '5px',
                        }}
                    >
                        /100
                    </Typography>
                </Typography>
            </Box>
        </Box>
    );
};

export default ScoreTooltip;