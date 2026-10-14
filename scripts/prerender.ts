/**
 * Static pre-rendering for GitHub Pages, run after `vite build`.
 *
 * Pages has no URL rewriting, so without this every deep link would be served
 * by 404.html with a 404 status, and search engines would drop it. For every
 * route this writes a real HTML file (served with 200) carrying the page's own
 * <title>, description, canonical URL, Open Graph/Twitter tags, JSON-LD and a
 * plain-HTML version of its content inside #root, which React replaces on load.
 * Unknown URLs get 404.html, marked noindex. Also writes sitemap.xml and robots.txt.
 *
 * Detail pages are written as `politicians/<id>.html`, which Pages serves at
 * `/politicians/<id>`. List pages exist both as `politicians.html` and
 * `politicians/index.html`, because a folder of the same name exists.
 *
 * Usage: SITE_URL=https://example.com/political-radar/ vite-node scripts/prerender.ts
 */
import {mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {dirname, join} from 'node:path';
import type {Meta, Party, Politician, Statement} from '../src/data/types';
import {RATING_BY_KEY} from '../src/data/ratings';
import {
    homeMeta, methodMeta, notFoundMeta, PageMeta, partiesMeta, partyMeta, politicianMeta, politiciansMeta, SITE_NAME,
} from '../src/seo/meta';

const OUT = 'build';
const SITE_URL = (process.env.SITE_URL || `http://localhost:4173${process.env.BASE_PATH || '/'}`).replace(/\/?$/, '/');

const read = <T, >(path: string): T => JSON.parse(readFileSync(join(OUT, 'data', path), 'utf8'));
const politicians = read<Politician[]>('politicians.json');
const parties = read<Party[]>('parties.json');
const meta = read<Meta>('meta.json');
const template = readFileSync(join(OUT, 'index.html'), 'utf8');

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const url = (path: string) => SITE_URL + path;
const link = (path: string, text: string) => `<a href="${esc(url(path))}">${esc(text)}</a>`;
const unquote = (s: string) => s.replace(/^[\s«"“]+|[\s»"”]+$/g, '');

function head(page: PageMeta): string {
    const tags = [
        `<link rel="canonical" href="${esc(url(page.path))}"/>`,
        `<meta name="robots" content="${page.noindex ? 'noindex' : 'index, follow'}"/>`,
        `<meta property="og:type" content="website"/>`,
        `<meta property="og:site_name" content="${SITE_NAME}"/>`,
        `<meta property="og:locale" content="it_IT"/>`,
        `<meta property="og:title" content="${esc(page.title)}"/>`,
        `<meta property="og:description" content="${esc(page.description)}"/>`,
        `<meta property="og:url" content="${esc(url(page.path))}"/>`,
        `<meta property="og:image" content="${esc(url('og-image.png'))}"/>`,
        `<meta property="og:image:width" content="1200"/>`,
        `<meta property="og:image:height" content="630"/>`,
        `<meta property="og:image:alt" content="${SITE_NAME}"/>`,
        `<meta name="twitter:card" content="summary_large_image"/>`,
    ];
    const ld: object[] = [];
    if (page.path === '') {
        ld.push({'@context': 'https://schema.org', '@type': 'WebSite', name: SITE_NAME, url: url(''), inLanguage: 'it'});
    }
    if (page.breadcrumb) {
        ld.push({
            '@context': 'https://schema.org', '@type': 'BreadcrumbList',
            itemListElement: [{name: SITE_NAME, path: ''}, ...page.breadcrumb].map((b, i) => ({
                '@type': 'ListItem', position: i + 1, name: b.name, item: url(b.path),
            })),
        });
    }
    for (const data of ld) {
        tags.push(`<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`);
    }
    return tags.join('\n    ');
}

function render(page: PageMeta, body: string): string {
    return template
        .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(page.title)}</title>`)
        .replace(/<meta\s+name="description"[\s\S]*?\/>/, `<meta name="description" content="${esc(page.description)}"/>`)
        .replace('</head>', `    ${head(page)}\n</head>`)
        .replace('<div id="root"></div>', `<div id="root"><div class="prerender">${body}</div></div>`);
}

function write(file: string, html: string) {
    mkdirSync(dirname(join(OUT, file)), {recursive: true});
    writeFileSync(join(OUT, file), html);
}

const nav = `<nav>${link('', 'Home')} · ${link('politicians/', 'Politici')} · ${link('parties/', 'Partiti')} · ${link('metodo', 'Come funziona')}</nav>`;
const scoreText = (s: {reliable: boolean; score: number; score_low: number; score_high: number; rated: number}) =>
    s.reliable ? `Attendibilità ${s.score}/100 (margine ${s.score_low}–${s.score_high}), ${s.rated} verifiche` : `Dati insufficienti (${s.rated} verifiche)`;

const pages: {file: string; page: PageMeta; body: string}[] = [];

pages.push({
    file: 'index.html', page: homeMeta(),
    body: `${nav}<h1>${SITE_NAME}</h1><p>${esc(homeMeta().description)}</p>`
        + `<h2>Politici più verificati</h2><ul>${politicians.slice(0, 20).map((p) => `<li>${link(`politicians/${p.id}`, p.name)}</li>`).join('')}</ul>`
        + `<h2>Partiti</h2><ul>${parties.map((p) => `<li>${link(`parties/${p.id}`, p.name)}</li>`).join('')}</ul>`,
});
pages.push({
    file: 'politicians/index.html', page: politiciansMeta(politicians.length),
    body: `${nav}<h1>Politici</h1><ul>${politicians.map((p) =>
        `<li>${link(`politicians/${p.id}`, p.name)}${p.party ? ` (${esc(p.party)})` : ''}: ${scoreText(p)}</li>`).join('')}</ul>`,
});
pages.push({
    file: 'parties/index.html', page: partiesMeta(parties.length),
    body: `${nav}<h1>Partiti</h1><ul>${parties.map((p) => `<li>${link(`parties/${p.id}`, p.name)}: ${scoreText(p)}</li>`).join('')}</ul>`,
});
pages.push({
    file: 'metodo.html', page: methodMeta(),
    body: `${nav}<h1>Come funziona</h1><p>${esc(methodMeta().description)}</p><p>Dati: ${link('', meta.source.name)} (${esc(meta.source.url)}).</p>`,
});
for (const p of politicians) {
    const statements = read<Statement[]>(`statements/${p.id}.json`);
    const items = statements.slice(0, 50).map((s) =>
        `<li>${s.rating ? `<strong>${esc(RATING_BY_KEY[s.rating].label)}</strong>: ` : ''}«${esc(unquote(s.claim))}» `
        + `<a href="${esc(s.factCheck)}" rel="noopener">Verifica di Pagella Politica</a></li>`).join('');
    pages.push({
        file: `politicians/${p.id}.html`, page: politicianMeta(p),
        body: `${nav}<h1>${esc(p.name)}</h1>`
            + (p.party && p.partySlug ? `<p>${link(`parties/${p.partySlug}`, p.party)}</p>` : '')
            + `<p>${scoreText(p)}.</p><h2>Le dichiarazioni verificate</h2><ul>${items}</ul>`,
    });
}
for (const party of parties) {
    const members = politicians.filter((p) => p.partySlug === party.id);
    pages.push({
        file: `parties/${party.id}.html`, page: partyMeta(party),
        body: `${nav}<h1>${esc(party.name)}</h1><p>${scoreText(party)}.</p>`
            + `<h2>Esponenti</h2><ul>${members.map((m) => `<li>${link(`politicians/${m.id}`, m.name)}</li>`).join('')}</ul>`,
    });
}

for (const {file, page, body} of pages) {
    write(file, render(page, body));
    if (file.endsWith('/index.html')) write(file.replace('/index.html', '.html'), render(page, body));
}
write('404.html', render(notFoundMeta(), `${nav}<h1>Pagina non trovata</h1>`));

const today = meta.generatedAt.slice(0, 10);
const lastmod: Record<string, string> = {};
for (const p of politicians) lastmod[`politicians/${p.id}`] = p.last_date ?? today;
for (const p of parties) lastmod[`parties/${p.id}`] = p.last_date ?? today;
const sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    + pages.map(({page}) => `  <url><loc>${esc(url(page.path))}</loc><lastmod>${lastmod[page.path] ?? today}</lastmod></url>`).join('\n')
    + '\n</urlset>\n';
write('sitemap.xml', sitemap);
write('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${url('sitemap.xml')}\n`);

console.log(`prerendered ${pages.length} pages + 404.html, sitemap with ${pages.length} URLs, base ${SITE_URL}`);
