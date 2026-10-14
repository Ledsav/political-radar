import React from 'react';
import StyledCard from '../shared/StyledCard';
import {CardScore} from '../politicians/PoliticianCard';
import {Party} from '../../data/types';

const PartyCard: React.FC<{party: Party}> = ({party}) => (
    <StyledCard
        title={party.name}
        subtitle={`${party.politicians} ${party.politicians === 1 ? 'politico' : 'politici'}`}
        linkTo={`/parties/${party.id}`}
    >
        <CardScore entity={party}/>
    </StyledCard>
);

export default PartyCard;
