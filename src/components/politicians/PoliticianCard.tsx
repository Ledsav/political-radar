import React from 'react';
import {Box, Typography} from '@mui/material';
import StyledCard from '../shared/StyledCard';
import VerdictBar from '../shared/VerdictBar';
import {Party, Politician} from '../../data/types';

export const CardScore: React.FC<{entity: Politician | Party}> = ({entity}) => (
    <Box sx={{mt: 1}}>
        <Typography variant="body2" sx={{mb: 0.5}}>
            {entity.reliable ? <><strong>{entity.score}</strong>/100 <Box component="span" sx={{color: '#555'}}>({entity.score_low}–{entity.score_high})</Box> · </> : 'Dati insufficienti · '}
            {entity.rated} verifiche
        </Typography>
        <VerdictBar breakdown={entity.breakdown} height={12} showLegend={false}/>
    </Box>
);

const PoliticianCard: React.FC<{politician: Politician}> = ({politician}) => (
    <StyledCard
        title={politician.name}
        subtitle={politician.party ?? 'Senza partito'}
        linkTo={`/politicians/${politician.id}`}
        image={politician.image}
        objectFit="cover"
        objectPosition="50% 20%"
    >
        <CardScore entity={politician}/>
    </StyledCard>
);

export default PoliticianCard;
