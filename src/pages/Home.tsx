import React from 'react';
import Layout from '../components/shared/Layout';
import MainPageContent from '../components/home/MainPageContent';
import {homeMeta} from '../seo/meta';
import {useDocumentMeta} from '../seo/useDocumentMeta';

const Home: React.FC = () => {
    useDocumentMeta(homeMeta());
    return (
        <Layout>
            <MainPageContent/>
        </Layout>
    );
};

export default Home;
