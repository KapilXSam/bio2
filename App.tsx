import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { NewsFeed } from './components/NewsFeed';
import { NewsDetailModal } from './components/NewsDetailModal';
import { SourcesDashboard } from './components/SourcesDashboard';
import { LiveSearchResults } from './components/LiveSearchResults';
import { Spinner } from './components/Spinner';
import type { Item, LiveSearchResult, FilterState, KeywordProfile } from './types';
import { generateNewsFeed, performLiveSearch, generateNewsletterHtml } from './services/geminiService';
import { DEBOUNCE_DELAY_MS } from './constants';
import { KeywordManagerModal } from './components/KeywordManagerModal';
import { DashboardView } from './components/DashboardView';

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
    const [currentView, setCurrentView] = useState<'feed' | 'sources' | 'dashboard'>('dashboard');
    const [items, setItems] = useState<Item[]>([]);
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [isLoadingFeed, setIsLoadingFeed] = useState<boolean>(true);
    
    const [isKeywordModalOpen, setIsKeywordModalOpen] = useState<boolean>(false);
    const [customKeywordProfiles, setCustomKeywordProfiles] = useState<KeywordProfile[]>(() => {
        try {
            const saved = localStorage.getItem('customKeywordProfiles');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Failed to parse custom profiles from localStorage', error);
            return [];
        }
    });
    
    const [filters, setFilters] = useState<FilterState>(() => {
         try {
            const saved = localStorage.getItem('newsFilters');
            return saved ? JSON.parse(saved) : {
                searchTerm: '',
                dateRange: '30',
                jurisdictions: [],
                eventTypes: [],
                therapeuticAreas: [],
                companies: [],
            };
        } catch (error) {
            console.error('Failed to parse filters from localStorage', error);
            return {
                searchTerm: '',
                dateRange: '30',
                jurisdictions: [],
                eventTypes: [],
                therapeuticAreas: [],
                companies: [],
            };
        }
    });
    
    const [liveSearchQuery, setLiveSearchQuery] = useState<string>('');
    const [displayQuery, setDisplayQuery] = useState('');
    const [liveSearchResult, setLiveSearchResult] = useState<LiveSearchResult | null>(null);
    const [isLoadingSearch, setIsLoadingSearch] = useState<boolean>(false);
    const [hasSearched, setHasSearched] = useState<boolean>(false);
    const [isGeneratingNewsletter, setIsGeneratingNewsletter] = useState<boolean>(false);

    const debouncedFilters = useDebounce(filters, DEBOUNCE_DELAY_MS);

    // Save filters to localStorage
    useEffect(() => {
        try {
            localStorage.setItem('newsFilters', JSON.stringify(filters));
        } catch (error) {
            console.error('Failed to save filters to localStorage', error);
        }
    }, [filters]);

    // Save custom profiles to localStorage
    useEffect(() => {
        try {
            localStorage.setItem('customKeywordProfiles', JSON.stringify(customKeywordProfiles));
        } catch (error) {
            console.error('Failed to save custom profiles to localStorage', error);
        }
    }, [customKeywordProfiles]);

    const loadNewsFeed = useCallback(async (currentFilters: FilterState) => {
        setIsLoadingFeed(true);
        try {
            const results = await generateNewsFeed(currentFilters);
            setItems(results);
        } catch (error) {
            console.error("Failed to load news feed:", error);
        } finally {
            setIsLoadingFeed(false);
        }
    }, []);

    useEffect(() => {
        if (currentView === 'feed' || currentView === 'dashboard') {
            loadNewsFeed(debouncedFilters);
        }
    }, [debouncedFilters, loadNewsFeed, currentView]);

    const handleLiveSearch = useCallback(async (query: string) => {
        if (!query.trim()) return;
        setLiveSearchQuery(query);
        setDisplayQuery(query);
        setIsLoadingSearch(true);
        setHasSearched(true);
        setCurrentView('feed');
        try {
            const result = await performLiveSearch(query);
            setLiveSearchResult(result);
        } catch (error) {
            console.error("Failed to perform live search:", error);
        } finally {
            setIsLoadingSearch(false);
        }
    }, []);

    const handleGlobalSearch = (term: string) => {
        setFilters(prev => ({ ...prev, searchTerm: term }));
        setCurrentView('feed');
        // Reset live search state to avoid UI confusion
        setLiveSearchQuery('');
        setDisplayQuery('');
        setLiveSearchResult(null);
        setHasSearched(false);
    };

    const handleDownload = async () => {
        if (isGeneratingNewsletter) return;

        if (items.length === 0) {
            alert("No news items to generate a newsletter from. Adjust filters to broaden your results.");
            return;
        }

        setIsGeneratingNewsletter(true);
        try {
            const newsletterHtml = await generateNewsletterHtml(items, filters);

            const printWindow = window.open('', '_blank');
            if (printWindow) {
                printWindow.document.write(newsletterHtml);
                printWindow.document.close();
                printWindow.focus();
                setTimeout(() => {
                    printWindow.print();
                    printWindow.close();
                }, 500); // Wait for rendering
            } else {
                alert('Could not open print window. Please check your pop-up blocker settings.');
            }
        } catch (error) {
            console.error("Failed to generate newsletter:", error);
            alert("An error occurred while generating the newsletter. Please try again.");
        } finally {
            setIsGeneratingNewsletter(false);
        }
    };

    const handleCardClick = (item: Item) => setSelectedItem(item);
    const handleCloseModal = () => setSelectedItem(null);
    const handleNavigate = (view: 'feed' | 'sources' | 'dashboard') => {
        setLiveSearchQuery('');
        setCurrentView(view);
    };
    
    const MainContent: React.FC = () => {
        if (currentView === 'sources') return <SourcesDashboard />;
        if (currentView === 'dashboard') return <DashboardView 
            items={items} 
            isLoading={isLoadingFeed}
            onNavigate={handleNavigate}
            onManageKeywords={() => setIsKeywordModalOpen(true)}
            onDownload={handleDownload}
            onCardClick={handleCardClick}
            isGeneratingNewsletter={isGeneratingNewsletter}
            />;

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
            <Header currentView={currentView} onNavigate={handleNavigate} onGlobalSearch={handleGlobalSearch} />
            <div className="flex">
                <Sidebar 
                    filters={filters} 
                    onFiltersChange={setFilters} 
                    onLiveSearch={handleLiveSearch} 
                    onManageKeywords={() => setIsKeywordModalOpen(true)}
                    items={items}
                    onDownload={handleDownload}
                    isGeneratingNewsletter={isGeneratingNewsletter}
                />
                <main className="flex-1 overflow-y-auto" style={{ height: 'calc(100vh - 64px)' }}>
                   <MainContent />
                </main>
            </div>
            {selectedItem && <NewsDetailModal item={selectedItem} onClose={handleCloseModal} />}
            {isKeywordModalOpen && (
                <KeywordManagerModal 
                    onClose={() => setIsKeywordModalOpen(false)}
                    customProfiles={customKeywordProfiles}
                    onUpdateProfiles={setCustomKeywordProfiles}
                />
            )}
        </div>
    );
};

export default App;
