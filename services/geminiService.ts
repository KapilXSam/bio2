
import { GoogleGenAI } from '@google/genai';
import type { Item, LiveSearchResult, FilterState } from '../types';

// Mock data to simulate API responses for the news feed
const mockItems: Item[] = [
    {
        id: '1',
        title: 'Celltrion files for regulatory approval of its Ocrevus biosimilar in Europe',
        summary: 'Celltrion has submitted a marketing authorization application to the European Medicines Agency (EMA) for its ocrelizumab biosimilar, CT-P53, referencing Roche\'s Ocrevus. The submission is based on a global Phase III clinical trial demonstrating equivalence in efficacy and safety.',
        source_url: 'https://www.celltrion.com/en-us/media/press-releases',
        source_type: 'Press Release',
        published_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        jurisdiction: 'EU',
        event_type: 'RegulatorySubmission',
        metrics: { relevance_score: 0.9, impact_score: 0.8, confidence_score: 0.95 },
        entities: { molecules_inn: ['ocrelizumab'], sponsors: ['Celltrion', 'Roche'], therapeutic_areas: ['Multiple Sclerosis', 'Immunology'] },
        citations: [],
    },
    {
        id: '2',
        title: 'Amgen announces positive top-line results for Phase 3 study of ustekinumab biosimilar',
        summary: 'Amgen has announced positive top-line results from its Phase 3 study evaluating the efficacy and safety of ABP 654, a biosimilar candidate to Janssen\'s Stelara (ustekinumab), in patients with moderate to severe plaque psoriasis. The study met its primary efficacy endpoint.',
        source_url: 'https://www.amgen.com/newsroom/press-releases',
        source_type: 'Press Release',
        published_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        jurisdiction: 'US',
        event_type: 'ClinicalTrialUpdate',
        metrics: { relevance_score: 0.95, impact_score: 0.85, confidence_score: 0.98 },
        entities: { molecules_inn: ['ustekinumab'], sponsors: ['Amgen', 'Janssen'], therapeutic_areas: ['Immunology', 'Dermatology'] },
        citations: ['https://clinicaltrials.gov/study/NCT04524453'],
    },
     {
        id: '3',
        title: 'Samsung Bioepis and Organon Launch Hadlima™ (adalimumab-bwwd) in the United States',
        summary: 'Samsung Bioepis and its commercialization partner Organon announced the U.S. launch of Hadlima™ (adalimumab-bwwd), a biosimilar to Humira. The launch includes both high-concentration and low-concentration formulations, offering more options for patients.',
        source_url: 'https://www.samsungbioepis.com/en/newsroom/newsroomView.do',
        source_type: 'News Article',
        published_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        jurisdiction: 'US',
        event_type: 'Launch',
        metrics: { relevance_score: 1.0, impact_score: 0.9, confidence_score: 1.0 },
        entities: { molecules_inn: ['adalimumab'], sponsors: ['Samsung Bioepis', 'Organon'], therapeutic_areas: ['Immunology', 'Rheumatology'] },
        citations: [],
    },
];


const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

/**
 * Generates the news feed. 
 * NOTE: This is a MOCKED implementation for demonstration purposes.
 * The real implementation using Gemini API is commented out below.
 */
export const generateNewsFeed = async (filters: FilterState): Promise<Item[]> => {
    console.log('Filtering with:', filters);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    let filteredItems = mockItems;

    // Apply filters to mock data
    if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase();
        filteredItems = filteredItems.filter(item =>
            item.title.toLowerCase().includes(term) ||
            item.summary.toLowerCase().includes(term) ||
            item.entities.sponsors.some(s => s.toLowerCase().includes(term))
        );
    }
     if (filters.jurisdictions.length > 0) {
        filteredItems = filteredItems.filter(item => filters.jurisdictions.includes(item.jurisdiction));
    }
    if (filters.eventTypes.length > 0) {
        filteredItems = filteredItems.filter(item => filters.eventTypes.includes(item.event_type));
    }
    if (filters.companies.length > 0) {
        filteredItems = filteredItems.filter(item => item.entities.sponsors.some(s => filters.companies.includes(s)));
    }
     if (filters.therapeuticAreas.length > 0) {
        filteredItems = filteredItems.filter(item => item.entities.therapeutic_areas.some(ta => filters.therapeuticAreas.includes(ta)));
    }
    if (filters.dateRange !== 'all') {
        const days = parseInt(filters.dateRange, 10);
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - days);
        filteredItems = filteredItems.filter(item => new Date(item.published_at) >= cutoff);
    }

    return Promise.resolve(filteredItems);
};


export const performLiveSearch = async (query: string): Promise<LiveSearchResult | null> => {
    if (!query) return null;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Based on the latest web search results, provide a concise summary answering the following query related to the biosimilar and pharmaceutical industry: "${query}". Also, provide the most relevant source URLs from the search results.`,
            config: {
                tools: [{googleSearch: {}}],
            },
        });
        
        const summary = response.text;
        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        
        const sources = groundingChunks
            // FIX: Ensure chunk and chunk.web are defined before accessing properties
            .map((chunk: any) => ({
                url: chunk?.web?.uri || '',
                title: chunk?.web?.title || 'Untitled Source',
            }))
            .filter((source: { url: string; }) => source.url)
            .filter((source: { url: string; }, index: number, self: { url: string; }[]) => index === self.findIndex((s) => s.url === source.url));

        return { summary, sources };

    } catch (error) {
        console.error("Error performing live search:", error);
        return { summary: 'An error occurred during the search. Please check your API key and try again.', sources: [] };
    }
};

/*
// --- REAL GEMINI IMPLEMENTATION FOR generateNewsFeed ---

import { Type } from '@google/genai';

const newsItemSchema = { ... }; // Define schema as in planning phase

const generatePromptFromFilters = (filters: FilterState): string => {
    let prompt = `
        Scan the latest news, press releases, and clinical trial updates related to the biosimilar industry. 
        Extract a list of the top 20 most relevant items based on the following criteria.
        Format the output as a JSON array of objects.
    `;
    if (filters.searchTerm) prompt += `\n- The items must be relevant to the search term: "${filters.searchTerm}"`;
    if (filters.jurisdictions.length > 0) prompt += `\n- Focus on these jurisdictions: ${filters.jurisdictions.join(', ')}`;
    if (filters.eventTypes.length > 0) prompt += `\n- Only include these event types: ${filters.eventTypes.join(', ')}`;
    if (filters.companies.length > 0) prompt += `\n- Must involve these companies: ${filters.companies.join(', ')}`;
    if (filters.therapeuticAreas.length > 0) prompt += `\n- Related to these therapeutic areas: ${filters.therapeuticAreas.join(', ')}`;
    if (filters.dateRange !== 'all') prompt += `\n- Published within the last ${filters.dateRange} days.`;
    
    return prompt;
};

export const generateNewsFeed = async (filters: FilterState): Promise<Item[]> => {
    const prompt = generatePromptFromFilters(filters);
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: [{ parts: [{ text: prompt }] }],
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.ARRAY,
                    items: newsItemSchema
                }
            }
        });
        
        const jsonText = response.text.trim();
        const data = JSON.parse(jsonText);
        return data as Item[];

    } catch (error) {
        console.error("Error generating news feed:", error);
        return [];
    }
};
*/
