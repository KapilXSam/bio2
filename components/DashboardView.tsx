import React, { useMemo } from 'react';
import type { Item } from '../types';
import { Spinner } from './Spinner';
import { NewsCard } from './NewsCard';
import { sourcesData } from '../data/sourcesData';
import { ALL_COMPANIES } from '../constants';
import { MailIcon, RssIcon, OfficeBuildingIcon, CogIcon, PlusIcon } from './Icons';

// Local component for dashboard statistic cards
const DashboardStatCard: React.FC<{ value: string; label: string }> = ({ value, label }) => {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm text-center border border-gray-200 dark:border-gray-700">
            <p className="text-4xl font-bold text-teal-600 dark:text-teal-400">{value}</p>
            <p className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-400">{label}</p>
        </div>
    );
};

// Local component for dashboard action cards
const ActionCard: React.FC<{ icon: React.ReactNode; title: string; description: string; onClick: () => void; }> = ({ icon, title, description, onClick }) => {
    return (
        <div
            onClick={onClick}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer border border-gray-200 dark:border-gray-700"
        >
            <div className="flex justify-center mb-3 text-teal-600 dark:text-teal-400">
                {icon}
            </div>
            <div className="text-center">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">{title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>
            </div>
        </div>
    );
};

interface DashboardViewProps {
    items: Item[];
    isLoading: boolean;
    onNavigate: (view: 'feed' | 'sources' | 'dashboard') => void;
    onManageKeywords: () => void;
    onDownload: () => void;
    onCardClick: (item: Item) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ items, isLoading, onNavigate, onManageKeywords, onDownload, onCardClick }) => {

    const stats = useMemo(() => {
        const newsThisWeek = items.filter(item => {
            const itemDate = new Date(item.published_at);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return itemDate >= weekAgo;
        }).length;

        const activeFeeds = sourcesData.news_sources.source_groups.reduce((acc, group) => acc + group.sources.length, 0);

        return {
            companiesMonitored: ALL_COMPANIES.length,
            activeRssFeeds: activeFeeds,
            newsItemsThisWeek: newsThisWeek,
            newsletterRecipients: 301, // Mock data from image
        };
    }, [items]);
    
    const recentNews = useMemo(() => {
        return [...items]
            .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
            .slice(0, 5);
    }, [items]);

    if (isLoading) {
        return <div className="flex justify-center items-center h-full"><Spinner /></div>;
    }
    
    return (
        <div className="bg-stone-50 dark:bg-gray-900 min-h-full p-4 md:p-6 lg:p-8 space-y-8">
            <header className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                <button 
                    onClick={onDownload}
                    className="px-4 py-2 text-sm font-semibold text-white bg-teal-600 rounded-md hover:bg-teal-700 transition-colors flex items-center"
                >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Generate Newsletter
                </button>
            </header>

            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <DashboardStatCard value={stats.companiesMonitored.toString()} label="Companies Monitored" />
                <DashboardStatCard value={stats.activeRssFeeds.toString()} label="Active RSS Feeds" />
                <DashboardStatCard value={stats.newsItemsThisWeek.toString()} label="News Items This Week" />
                <DashboardStatCard value={stats.newsletterRecipients.toString()} label="Newsletter Recipients" />
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <ActionCard 
                    icon={<MailIcon className="h-8 w-8" />} 
                    title="Generate Newsletter" 
                    description="Create and send weekly newsletter" 
                    onClick={onDownload} 
                />
                <ActionCard 
                    icon={<RssIcon className="h-8 w-8" />} 
                    title="Add News Source" 
                    description="Configure new RSS feed" 
                    onClick={() => onNavigate('sources')} 
                />
                <ActionCard 
                    icon={<OfficeBuildingIcon className="h-8 w-8" />} 
                    title="View Companies" 
                    description="Manage company monitoring" 
                    onClick={() => onNavigate('feed')} 
                />
                <ActionCard 
                    icon={<CogIcon className="h-8 w-8" />} 
                    title="Configure Keywords" 
                    description="Manage monitoring keywords" 
                    onClick={onManageKeywords} 
                />
            </section>

            <section>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Recent News</h2>
                {recentNews.length > 0 ? (
                    <div className="space-y-4">
                        {recentNews.map(item => (
                            <NewsCard key={item.id} item={item} onClick={() => onCardClick(item)} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm text-center text-gray-500 dark:text-gray-400">
                        <p>No recent news items found based on your filters.</p>
                    </div>
                )}
            </section>
        </div>
    );
};
