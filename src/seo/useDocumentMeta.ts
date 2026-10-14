import {useEffect} from 'react';
import {PageMeta} from './meta';

function setTag(selector: string, create: () => HTMLElement, attr: string, value: string) {
    let el = document.head.querySelector<HTMLElement>(selector);
    if (!el) {
        el = create();
        document.head.appendChild(el);
    }
    el.setAttribute(attr, value);
}

const metaTag = (key: 'name' | 'property', id: string) => () => {
    const el = document.createElement('meta');
    el.setAttribute(key, id);
    return el;
};

/** Keeps <title>, description, canonical and social tags in sync during client-side navigation. */
export function useDocumentMeta(meta: PageMeta | null) {
    useEffect(() => {
        if (!meta) return;
        const url = new URL(`${import.meta.env.BASE_URL}${meta.path}`, window.location.origin).href;
        document.title = meta.title;
        setTag('meta[name="description"]', metaTag('name', 'description'), 'content', meta.description);
        setTag('meta[property="og:title"]', metaTag('property', 'og:title'), 'content', meta.title);
        setTag('meta[property="og:description"]', metaTag('property', 'og:description'), 'content', meta.description);
        setTag('meta[property="og:url"]', metaTag('property', 'og:url'), 'content', url);
        setTag('link[rel="canonical"]', () => {
            const el = document.createElement('link');
            el.rel = 'canonical';
            return el;
        }, 'href', url);
        setTag('meta[name="robots"]', metaTag('name', 'robots'), 'content', meta.noindex ? 'noindex' : 'index, follow');
    }, [meta?.title, meta?.description, meta?.path, meta?.noindex]);
}
