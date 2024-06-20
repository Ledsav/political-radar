import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {ThemeProvider} from '@mui/material/styles';
import Home from './pages/Home';
import Politicians from './pages/Politicians';
import Parties from './pages/Parties';
import PoliticianDetailPage from './pages/PoliticianDetails';
import PartyDetailPage from './pages/PartyDetails';
import theme from "./theme/theme";
import {CssBaseline} from '@mui/material';

const App: React.FC = () => {
    return (
        <ThemeProvider theme={theme}> {/* Wrap everything in ThemeProvider */}
            <CssBaseline/> {/* Normalize CSS across browsers */}
            <Router>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/politicians" element={<Politicians/>}/>
                    <Route path="/parties" element={<Parties/>}/>
                    <Route path="/politicians/:id" element={<PoliticianDetailPage/>}/>
                    <Route path="/parties/:id" element={<PartyDetailPage/>}/>
                </Routes>
            </Router>
        </ThemeProvider>
    );
};

export default App;
