import React from 'react';
import Layout from '../components/shared/Layout';
import {NotFoundMessage} from '../components/shared/Status';

const NotFound: React.FC = () => (
    <Layout>
        <NotFoundMessage what="Contenuto"/>
    </Layout>
);

export default NotFound;
