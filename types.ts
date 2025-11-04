export interface Metrics {
  relevance_score: number;
  impact_score: number;
  confidence_score: number;
}

export interface Entities {
  molecules_inn: string[];
  sponsors: string[];
  therapeutic_areas: string[];
}

export interface Item {
  id: string;
  title: string;
  summary: string;
  source_url: string;
  source_type: string;
  published_at: string;
  jurisdiction: string;
  event_type: string;
  metrics: Metrics;
  entities: Entities;
  citations: string[];
}

export interface LiveSearchResult {
  summary: string;
  sources: {
    url: string;
    title: string;
  }[];
}

export interface FilterState {
  searchTerm: string;
  dateRange: string;
  jurisdictions: string[];
  eventTypes: string[];
  therapeuticAreas: string[];
  companies: string[];
}

export interface KeywordProfile {
    id: string;
    name: string;
    keywords: string[];
    description: string;
    isCustom?: boolean;
}