import React from 'react';
import ReactDOM from 'react-dom/client';
// Fonts are bundled with the app rather than loaded from Google Fonts, so
// visitors' browsers never contact a third party.
import '@fontsource/roboto/latin-300.css';
import '@fontsource/roboto/latin-400.css';
import '@fontsource/roboto/latin-500.css';
import '@fontsource/roboto/latin-700.css';
import '@fontsource/antonio/latin-400.css';
import '@fontsource/antonio/latin-700.css';
import './index.css';
import App from './App';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>
);
