import React from 'react';
import { Link } from 'react-router-dom';

const Navigation: React.FC = () => {
    return (
        <nav>
            <ul>
                <li><Link to="/">Radar Politico</Link></li>
                <li><Link to="/politicians">Politici</Link></li>
                <li><Link to="/parties">Partiti</Link></li>
                <li><Link to="/map">Mappa</Link></li>
            </ul>
        </nav>
    );
};

export default Navigation;
