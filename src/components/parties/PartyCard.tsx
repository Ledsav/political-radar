import React from 'react';
import StyledCard from '../shared/StyledCard';
import {CardScore} from '../politicians/PoliticianCard';
import {Party} from '../../data/types';
import {assetUrl} from '../../data/api';

const PartyCard: React.FC<{party: Party}> = ({party}) => (
    <StyledCard
        title={party.name}
        subtitle={`${party.politicians} ${party.politicians === 1 ? 'politico' : 'politici'}`}
        linkTo={`/parties/${party.id}`}
        image={party.logo ? assetUrl(party.logo.path) : null}
        objectFit="contain"
    >
        <CardScore entity={party}/>
    </StyledCard>
);

export default PartyCard;
