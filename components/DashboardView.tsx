import React, { useMemo } from 'react';
import type { Item } from '../types';
import { Spinner } from './Spinner';
import { StatCard } from './StatCard';
import { JurisdictionChart } from './JurisdictionChart';
import { EventTypeChart } from './EventTypeChart';
// FIX: Import RssIcon which was used in a StatCard but not imported.
import { ChartBarIcon, OfficeBuildingIcon, TagIcon, RssIcon } from './Icons';

interface DashboardViewProps {
    items: Item[];
    isLoading: boolean;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ items, isLoading }) => {

    const stats = useMemo(() => {
        if (!items || items.length === 0) {
            return {
                totalArticles: 0,
                topCompany: 'N/A',
                topEventType: 'N/A',
                jurisdictionData: [],
                eventTypeData: [],
            };
        }

        const jurisdictionCounts: { [key: string]: number } = {};
        const eventTypeCounts: { [key: string]: number } = {};
        const companyCounts: { [key: string]: number } = {};

        for (const item of items) {
            jurisdictionCounts[item.jurisdiction] = (jurisdictionCounts[item.jurisdiction] || 0) + 1;
            eventTypeCounts[item.event_type] = (eventTypeCounts[item.event_type] || 0) + 1;
            item.entities.sponsors.forEach(sponsor => {
                 companyCounts[sponsor] = (companyCounts[sponsor] || 0) + 1;
            });
        }
        
        const getTopKey = (obj: {[key: string]: number}) => Object.keys(obj).reduce((a, b) => obj[a] > obj[b] ? a : b, 'N/A');

        const jurisdictionData = Object.entries(jurisdictionCounts)
            .map(([label, value]) => ({ label, value }))
            .sort((a,b) => b.value - a.value);

        const eventTypeData = Object.entries(eventTypeCounts)
            .map(([label, value]) => ({ label: label.replace(/([A-Z])/g, ' $1').trim(), value }))
            .sort((a,b) => b.value - a.value);

        return {
            totalArticles: items.length,
            topCompany: getTopKey(companyCounts),
            topEventType: getTopKey(eventTypeCounts).replace(/([A-Z])/g, ' $1').trim(),
            jurisdictionData,
            eventTypeData,
        };
    }, [items]);

    if (isLoading) {
        return <div className="flex justify-center items-center h-full"><Spinner /></div>;
    }

    if (items.length === 0) {
        return (
          <div className="text-center py-20 px-4">
            <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No Data for Dashboard</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              There are no news items matching your current filters to display.
            </p>
          </div>
        );
    }

    return (
        <div className="p-4 md:p-6 lg:p-8 space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Intelligence Dashboard</h1>
                <p className="mt-1 text-md text-gray-600 dark:text-gray-400">A high-level overview of the current news feed.</p>
            </header>

            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="Total Articles" value={stats.totalArticles.toString()} icon={<RssIcon className="h-6 w-6" />} />
                <StatCard title="Most Active Company" value={stats.topCompany} icon={<OfficeBuildingIcon className="h-6 w-6" />} />
                <StatCard title="Top Event Type" value={stats.topEventType} icon={<TagIcon className="h-6 w-6" />} />
            </section>
            
            <section className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3">
                    <JurisdictionChart data={stats.jurisdictionData} />
                </div>
                 <div className="lg:col-span-2">
                    <EventTypeChart data={stats.eventTypeData} />
                </div>
            </section>
        </div>
    );
};
