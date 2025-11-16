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

export const generateNewsletterHtml = async (items: Item[], filters: FilterState): Promise<string> => {
    // Creating a summary of the active filters to provide context to the model.
    const filterContext = Object.entries(filters)
        .map(([key, value]) => {
            if (Array.isArray(value) && value.length > 0) return `* ${key}: ${value.join(', ')}`;
            if (typeof value === 'string' && value && key === 'dateRange' && value !== 'all') return `* Date Range: Last ${value} days`;
            if (typeof value === 'string' && value && key === 'searchTerm') return `* Main Keyword: "${value}"`;
            return null;
        })
        .filter(Boolean)
        .join('\n');

    const prompt = `
        You are a professional market intelligence analyst for the pharmaceutical and biosimilar industry. Your task is to generate a personalized HTML newsletter from a provided JSON dataset of news articles. The newsletter should be structured, insightful, and ready for distribution to executives.

        **CONTEXT:**
        The user has filtered these articles based on the following criteria:
        ${filterContext || "* No specific filters applied."}

        **NEWS DATA (JSON):**
        ${JSON.stringify(items, null, 2)}

        **INSTRUCTIONS:**
        1.  **Executive Summary:** Begin with a concise "Executive Summary" (2-3 paragraphs) that synthesizes the most critical developments and trends from the provided articles. This summary should provide a high-level overview for a busy reader.
        2.  **Categorization:** Group the news articles into logical categories based on the user's filtering criteria and the content of the news. Good examples are "Regulatory Milestones", "Clinical Trial Updates", "Key Company News", or specific therapeutic areas like "Oncology Developments". Use clear and descriptive headings for each category.
        3.  **Article Content:** For each article within a category:
            - Use the original "title" as a headline. Make it a clickable link using the "source_url".
            - Include a metadata line: "Source: [source_type] | Published: [published_at format as YYYY-MM-DD] | Jurisdiction: [jurisdiction]".
            - Write an expanded, insightful summary (3-4 sentences). Go beyond the original summary by elaborating on the potential impact and context, based on the provided data. DO NOT invent facts.
        4.  **Output Format:** The final output must be a single, complete HTML string with inline CSS.

        **HTML & CSS REQUIREMENTS:**
        - Create a self-contained HTML document including a <style> block in the <head>.
        - Use a professional and clean design. Light background, dark text.
        - The main title should be "Biosimilar Intelligence Newsletter".
        - Add a subtitle with the generation date and the total number of articles.
        - Use sans-serif fonts.
        - Use h1 for the main title, h2 for "Executive Summary" and category titles, and h3 for article titles.
        - Style links to be a distinct color (e.g., blue).
        - Use padding and margins to create a readable, uncluttered layout.
        - Here is a style guide to follow:
          <style>
              body { font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"; line-height: 1.6; margin: 2rem; color: #111827; background-color: #f9fafb; }
              h1 { font-size: 2.25rem; font-weight: bold; color: #1e3a8a; border-bottom: 2px solid #3b82f6; padding-bottom: 0.5rem; margin-bottom: 0.5rem; }
              h2 { font-size: 1.5rem; font-weight: bold; color: #1f2937; margin-top: 2.5rem; margin-bottom: 1rem; border-bottom: 1px solid #d1d5db; padding-bottom: 0.5rem;}
              h3 { font-size: 1.125rem; font-weight: bold; color: #111827; margin-bottom: 0.5rem; }
              p { margin-bottom: 1rem; }
              a { color: #2563eb; text-decoration: none; }
              a:hover { text-decoration: underline; }
              .header-meta { font-size: 1rem; color: #4b5563; margin-bottom: 2rem; }
              .article { border-bottom: 1px solid #e5e7eb; padding-bottom: 1.5rem; margin-bottom: 1.5rem; page-break-inside: avoid; }
              .article:last-child { border-bottom: none; }
              .article-meta { font-size: 0.875rem; color: #4b5563; margin-bottom: 1rem; border-left: 3px solid #d1d5db; padding-left: 1rem; }
          </style>
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: [{ parts: [{ text: prompt }] }],
        });

        return response.text;
    } catch (error) {
        console.error("Error generating newsletter HTML:", error);
        throw new Error("Failed to generate newsletter from AI. Please check the console for details.");
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