import React from 'react';
import Layout from '../components/shared/Layout';
import {useLocation} from 'react-router-dom';
import {NotFoundMessage} from '../components/shared/Status';
import {notFoundMeta} from '../seo/meta';
import {useDocumentMeta} from '../seo/useDocumentMeta';

const NotFound: React.FC = () => {
    useDocumentMeta(notFoundMeta(useLocation().pathname.replace(/^\//, '')));
    return (
        <Layout>
            <NotFoundMessage what="Contenuto"/>
        </Layout>
    );
};

export default NotFound;
