import {mapCredibilityScore} from "./scoresOperations"
import {SearchableItem} from '../types/types';

const formatDate = (date: string | { seconds: number, nanoseconds: number }) => {
    if (typeof date === 'string') {
        return new Date(date).toLocaleDateString('it-IT', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } else {
        return new Date(date.seconds * 1000).toLocaleDateString('it-IT', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
};

const parseSources = (sources: string): string[] => {
    console.log("Sources before parsing:", sources);

    // Function to clean up a single source string
    const cleanSource = (src: string): string =>
        src.trim().replace(/^['"]|['"]$/g, '').replace(/\\"/g, '"');

    // Try parsing as JSON
    try {
        const parsed = JSON.parse(sources);
        if (Array.isArray(parsed)) {
            return parsed.map(cleanSource);
        }
    } catch (error) {
        console.warn("JSON parse failed, attempting alternative parsing methods");
    }

    // If not valid JSON, try other parsing methods
    let cleanedSources = sources.trim()
        .replace(/^\[|\]$/g, '')  // Remove surrounding brackets if present
        .replace(/\\"/g, '"');    // Replace escaped quotes

    // Split by common delimiters
    const delimiters = [',', ' - ', '|', ';'];
    for (const delimiter of delimiters) {
        if (cleanedSources.includes(delimiter)) {
            return cleanedSources.split(delimiter).map(cleanSource).filter(Boolean);
        }
    }

    // If no common delimiter found, split by quotes
    const quoteSplit = cleanedSources.match(/('[^']+'|"[^"]+"|[^'" \t]+)/g);
    if (quoteSplit) {
        return quoteSplit.map(cleanSource).filter(Boolean);
    }

    // If all else fails, return the entire string as a single source
    return [cleanSource(cleanedSources)];
};

export const createReasonTemplate = (item: SearchableItem) => {
    const {average_score, count, first_date, last_date, sources} = item;
    const mappedScore = mapCredibilityScore(average_score);
    const formattedFirstDate = formatDate(first_date);
    const formattedLastDate = formatDate(last_date);
    const name = 'author' in item ? item.author : item.party;

    // Parse the sources field
    const parsedSources = parseSources(sources);

    return `
    Il punteggio di credibilità di ${mappedScore}/100 è stato calcolato sulla base di ${count} articoli verificati nel periodo dal ${formattedFirstDate} al ${formattedLastDate}.

    Questo punteggio riflette una media di affermazioni verificate come vere su un totale di ${count} dichiarazioni esaminate.

    È importante notare che questo punteggio è basato su un campione limitato di dichiarazioni e potrebbe non rappresentare completamente l'accuratezza complessiva di tutte le affermazioni fatte da ${name.toLowerCase()}.

    Le fonti utilizzate per questa valutazione includono:
   
    ${parsedSources.map(source => `- ${source}`).join('\n')}
    `;
};