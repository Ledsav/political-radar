import React from 'react';
import StyledCard from "../shared/StyledCard";

interface PoliticianCardProps {
    politician: {
        id: string;  // Ensure this is a string
        name: string;
        party: string;
        image: string;
    };
}

const PoliticianCard: React.FC<PoliticianCardProps> = ({politician}) => {
    return (
        <StyledCard
            id={politician.id}
            title={politician.name}
            subtitle={politician.party}
            linkTo={`/politicians/${politician.id}`}
            image={politician.image}
            objectFit={'cover'}
            objectPosition={'50% 20%'}
        />
    );
};

export default PoliticianCard;