import React from 'react';
import StyledCard from "../shared/StyledCard";

interface PoliticianCardProps {
    politician: {
        id: number;
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
        />
    );
};

export default PoliticianCard;
