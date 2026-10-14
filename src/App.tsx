import React, {lazy, Suspense} from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {ThemeProvider} from '@mui/material/styles';
import {CssBaseline} from '@mui/material';
import Home from './pages/Home';
import {Loading} from './components/shared/Status';
import theme from './theme/theme';

// Pages with charts pull in recharts; keep them out of the first load.
const Politicians = lazy(() => import('./pages/Politicians'));
const Parties = lazy(() => import('./pages/Parties'));
const PoliticianDetailPage = lazy(() => import('./pages/PoliticianDetails'));
const PartyDetailPage = lazy(() => import('./pages/PartyDetails'));
const Method = lazy(() => import('./pages/Method'));
const NotFound = lazy(() => import('./pages/NotFound'));

export const AppRoutes: React.FC = () => (
    <Suspense fallback={<Loading/>}>
    <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/politicians" element={<Politicians/>}/>
        <Route path="/parties" element={<Parties/>}/>
        <Route path="/politicians/:id" element={<PoliticianDetailPage/>}/>
        <Route path="/parties/:id" element={<PartyDetailPage/>}/>
        <Route path="/metodo" element={<Method/>}/>
        <Route path="*" element={<NotFound/>}/>
    </Routes>
    </Suspense>
);

const App: React.FC = () => (
    <ThemeProvider theme={theme}>
        <CssBaseline/>
        <Router basename={import.meta.env.BASE_URL}>
            <AppRoutes/>
        </Router>
    </ThemeProvider>
);

export default App;
