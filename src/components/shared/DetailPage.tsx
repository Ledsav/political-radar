import React from 'react';
import {Box, Grid, Typography, useMediaQuery, useTheme} from '@mui/material';
import ScoreTooltip from "./ScoreBox";


interface DetailPageProps {
    name: string;
    subtitle: string;
    description: string;
    credibilityScore: number;
    overallScore: number;
    activityScore: number;
    controversyScore: number;
    image: string;
    reason: string;
    topTopics: string;
    orientation: string;
    firstDate: string;
    lastDate: string;
    statementsCount: number;
}

const DetailPage: React.FC<DetailPageProps> = ({
                                                   name,
                                                   subtitle,
                                                   description,
                                                   credibilityScore,
                                                   overallScore,
                                                   activityScore,
                                                   controversyScore,
                                                   image,
                                                   reason,
                                                   topTopics,
                                                   orientation,
                                                   firstDate,
                                                   lastDate,
                                                   statementsCount,
                                               }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const scoreExplanations = {
        overall: "Un punteggio complessivo che combina credibilità e attività. È una media ponderata del punteggio di credibilità (60%) e del punteggio di attività (40%).",
        credibility: "Rappresenta l'accuratezza media delle dichiarazioni. Un punteggio più alto indica dichiarazioni generalmente più veritiere.",
        activity: "Indica quanto attivo è un partito o un politico rispetto agli altri (alla media). Si basa sul numero di dichiarazioni fatte.",
        controversy: "Misura quanto spesso un'entità fa dichiarazioni né chiaramente vere né false. Un punteggio più alto può indicare posizioni più sfumate o controverse rispetto al resto dei partiti/politici."
    };

    return (
        <Box sx={{padding: 0}}>
            <Box sx={{
                backgroundColor: theme.palette.primary.main,
                padding: 2,
                mb: 3,
                mt: isMobile ? 5 : 10,
                border: '1px solid black'
            }}>
                <Typography variant="h2" component="h1"
                            sx={{fontWeight: 'bold', mb: 1, fontSize: isMobile ? '3rem' : '5rem'}}>
                    {name.toUpperCase()}
                </Typography>
                <Typography variant="h5" component="h2"
                            sx={{
                                color: theme.palette.primary.contrastText,
                                fontWeight: 'regular',
                                fontSize: isMobile ? '1rem' : '1.5rem'
                            }}>
                    {subtitle}
                </Typography>
            </Box>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Box sx={{padding: '20px'}}>
                        <Typography variant="body1" sx={{paddingBottom: isMobile ? '30px' : '50px'}}>
                            {description}
                        </Typography>
                        <ScoreTooltip score={overallScore} label="complessivo" explanation={scoreExplanations.overall}/>
                        <ScoreTooltip score={credibilityScore} label="credibilità"
                                      explanation={scoreExplanations.credibility}/>
                        <ScoreTooltip score={activityScore} label="attività" explanation={scoreExplanations.activity}/>
                        <ScoreTooltip score={controversyScore} label="controversia"
                                      explanation={scoreExplanations.controversy}/>
                        {/*                        <Paper elevation={3} sx={{p: 2, mt: 3, backgroundColor: theme.palette.background.paper}}>
                            <Typography variant="h6" sx={{mb: 1}}>Legenda dei Punteggi</Typography>
                            <Typography variant="body2">
                                0-20: Molto Basso | 21-40: Basso | 41-60: Medio | 61-80: Alto | 81-100: Molto Alto
                            </Typography>
                        </Paper>*/}
                        <Box sx={{mt: isMobile ? 5 : 10}}>
                            <Typography variant="h4" component="h3"
                                        sx={{fontWeight: 'bold', mb: 1, fontSize: isMobile ? '1.5rem' : '2rem'}}>
                                Perchè?
                            </Typography>
                            <Typography variant="body1">
                                {reason}
                            </Typography>
                        </Box>
                        <Box sx={{mt: 3}}>
                            <Typography variant="h5" component="h4" sx={{fontWeight: 'bold', mb: 1}}>
                                Argomenti principali:
                            </Typography>
                            <Typography variant="body1">{topTopics}</Typography>
                        </Box>
                        <Box sx={{mt: 3}}>
                            <Typography variant="h5" component="h4" sx={{fontWeight: 'bold', mb: 1}}>
                                Orientamento:
                            </Typography>
                            <Typography variant="body1">{orientation}</Typography>
                        </Box>
                        <Box sx={{mt: 3}}>
                            <Typography variant="h5" component="h4" sx={{fontWeight: 'bold', mb: 1}}>
                                Periodo di attività:
                            </Typography>
                            <Typography variant="body1">Dal {firstDate} al {lastDate}</Typography>
                        </Box>
                        <Box sx={{mt: 3}}>
                            <Typography variant="h5" component="h4" sx={{fontWeight: 'bold', mb: 1}}>
                                Numero di dichiarazioni analizzate:
                            </Typography>
                            <Typography variant="body1">{statementsCount}</Typography>
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={12} md={6} sx={{position: 'relative', height: isMobile ? 'auto' : 'auto'}}>
                    <Box
                        component="img"
                        src={image}
                        alt={name}
                        sx={{
                            width: isMobile ? '80%' : '50%',
                            height: isMobile ? 'auto' : 'auto',
                            aspectRatio: '1 / 1',
                            objectFit: 'contain',
                            border: '1px solid black',
                            position: isMobile ? 'relative' : 'absolute',
                            top: isMobile ? '50%' : '-20px',
                            transform: isMobile ? 'translateY(-50%)' : 'none',
                            right: isMobile ? 'auto' : '100px',
                            left: isMobile ? '10%' : 'auto',
                            backgroundColor: theme.palette.secondary.main,
                            mb: isMobile ? 2 : 0,
                        }}
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default DetailPage;