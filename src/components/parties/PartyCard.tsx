import React from 'react';
import StyledCard from "../shared/StyledCard";

interface PartyCardProps {
    party: {
        id: string;
        name: string;
        orientation: string;
        image: string;
    };
}

const PartyCard: React.FC<PartyCardProps> = ({party}) => {
    return (
        <StyledCard
            id={party.id}
            title={party.name}
            subtitle={`${party.orientation}`}
            linkTo={`/parties/${party.id}`}
            image={party.image}
        />
    );
};

export default PartyCard;