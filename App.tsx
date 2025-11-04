
import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { NewsFeed } from './components/NewsFeed';
import { NewsDetailModal } from './components/NewsDetailModal';
import { SourcesDashboard } from './components/SourcesDashboard';
import { LiveSearchResults } from './components/LiveSearchResults';
import { Spinner } from './components/Spinner';
import type { Item, LiveSearchResult, FilterState } from './types';
import { generateNewsFeed, performLiveSearch } from './services/geminiService';
import { DEBOUNCE_DELAY_MS } from './constants';
import { KeywordManagerModal } from './components/KeywordManagerModal';

const useDebounce = <T,>(value: T, delay: number): T => {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
};


const App: React.FC = () => {
    const [currentView, setCurrentView] = useState<'feed' | 'sources'>('feed');
    const [items, setItems] = useState<Item[]>([]);
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [isLoadingFeed, setIsLoadingFeed] = useState<boolean>(true);
    
    const [isKeywordModalOpen, setIsKeywordModalOpen] = useState<boolean>(false);
    
    const [filters, setFilters] = useState<FilterState>({
        searchTerm: '',
        dateRange: '30',
        jurisdictions: [],
        eventTypes: [],
        therapeuticAreas: [],
        companies: [],
    });
    
    const [liveSearchQuery, setLiveSearchQuery] = useState<string>('');
    const [displayQuery, setDisplayQuery] = useState('');
    const [liveSearchResult, setLiveSearchResult] = useState<LiveSearchResult | null>(null);
    const [isLoadingSearch, setIsLoadingSearch] = useState<boolean>(false);
    const [hasSearched, setHasSearched] = useState<boolean>(false);

    const debouncedFilters = useDebounce(filters, DEBOUNCE_DELAY_MS);

    const loadNewsFeed = useCallback(async (currentFilters: FilterState) => {
        setIsLoadingFeed(true);
        try {
            const results = await generateNewsFeed(currentFilters);
            setItems(results);
        } catch (error) {
            console.error("Failed to load news feed:", error);
            // In a real app, show an error message to the user
        } finally {
            setIsLoadingFeed(false);
        }
    }, []);

    useEffect(() => {
        if (currentView === 'feed') {
            loadNewsFeed(debouncedFilters);
        }
    }, [debouncedFilters, loadNewsFeed, currentView]);

    const handleLiveSearch = useCallback(async (query: string) => {
        if (!query.trim()) return;
        setLiveSearchQuery(query);
        setDisplayQuery(query);
        setIsLoadingSearch(true);
        setHasSearched(true);
        setCurrentView('feed'); // Switch to feed view to show results
        try {
            const result = await performLiveSearch(query);
            setLiveSearchResult(result);
        } catch (error) {
            console.error("Failed to perform live search:", error);
        } finally {
            setIsLoadingSearch(false);
        }
    }, []);


    const handleCardClick = (item: Item) => {
        setSelectedItem(item);
    };

    const handleCloseModal = () => {
        setSelectedItem(null);
    };

    const handleNavigate = (view: 'feed' | 'sources') => {
        setLiveSearchQuery(''); // Clear search when navigating
        setCurrentView(view);
    }
    
    const MainContent: React.FC = () => {
        if (currentView === 'sources') {
            return <SourcesDashboard />;
        }

        if (liveSearchQuery) {
            return (
                <div className="p-4 md:p-6 lg:p-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 truncate">Live Search: "{displayQuery}"</h2>
                        <button 
                            onClick={() => setLiveSearchQuery('')} 
                            className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline flex-shrink-0 ml-4"
                        >
                            Back to News Feed
                        </button>
                    </div>
                    <LiveSearchResults result={liveSearchResult} isLoading={isLoadingSearch} hasSearched={hasSearched} />
                </div>
            );
        }

        return (
             <div className="p-4 md:p-6 lg:p-8">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Latest Intelligence Feed</h2>
                {isLoadingFeed ? <div className="flex justify-center py-20"><Spinner /></div> : <NewsFeed items={items} onCardClick={handleCardClick} />}
             </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
            <Header currentView={currentView} onNavigate={handleNavigate} />
            <div className="flex">
                <Sidebar 
                    filters={filters} 
                    onFiltersChange={setFilters} 
                    onLiveSearch={handleLiveSearch} 
                    onManageKeywords={() => setIsKeywordModalOpen(true)}
                />
                <main className="flex-1 overflow-y-auto" style={{ height: 'calc(100vh - 64px)' }}>
                   <MainContent />
                </main>
            </div>
            {selectedItem && <NewsDetailModal item={selectedItem} onClose={handleCloseModal} />}
            {isKeywordModalOpen && <KeywordManagerModal onClose={() => setIsKeywordModalOpen(false)} />}
        </div>
    );
};

export default App;
