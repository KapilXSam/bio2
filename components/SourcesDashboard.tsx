
import React, { useState, useEffect, useRef } from 'react';
import { sourcesData } from '../data/sourcesData';
import { Tag } from './Tag';
import { ExternalLinkIcon, ClockIcon, CogIcon, CodeIcon } from './Icons';

interface Source {
    name: string;
    url: string;
    tags: string[];
}

interface SourceGroup {
    group_name: string;
    sources: Source[];
}

const SourceCard: React.FC<{ source: Source }> = ({ source }) => (
    <a 
        href={source.url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="block bg-white dark:bg-gray-800/50 p-4 rounded-lg shadow-sm hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 border border-gray-200 dark:border-gray-700"
    >
        <div className="flex justify-between items-start">
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 pr-2">{source.name}</h4>
            <ExternalLinkIcon className="h-5 w-5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
            {source.tags.map(tag => (
                <Tag key={tag}>{tag}</Tag>
            ))}
        </div>
    </a>
);

const PolicyItem: React.FC<{ label: string; value: string | boolean;}> = ({ label, value }) => (
    <div>
        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</dt>
        <dd className="mt-1 text-sm text-gray-900 dark:text-white">
            {typeof value === 'boolean' ? (value ? 'Enabled' : 'Disabled') : value}
        </dd>
    </div>
);

export const SourcesDashboard: React.FC = () => {
    const { news_sources } = sourcesData as any; // Cast to handle changing data shape
    const [activeGroup, setActiveGroup] = useState<string>(news_sources.source_groups[0]?.group_name || '');
    const groupRefs = useRef<Record<string, HTMLElement | null>>({});

    const handleNavClick = (groupName: string) => {
        groupRefs.current[groupName]?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    };

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveGroup(entry.target.id);
                }
            });
        }, { rootMargin: "-50% 0px -50% 0px" });

        Object.values(groupRefs.current).forEach(ref => {
            if (ref) observer.observe(ref);
        });

        return () => observer.disconnect();
    }, []);

    return (
        <div className="max-w-screen-2xl mx-auto p-4 md:p-6 lg:p-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{news_sources.category}</h1>
                <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">{news_sources.description}</p>
                <div className="mt-3 text-sm text-gray-500 dark:text-gray-400 flex items-center">
                    <ClockIcon className="h-4 w-4 mr-1.5" />
                    Last Updated: {new Date(news_sources.updated_at).toLocaleDateString()}
                </div>
            </header>

            <div className="flex flex-col md:flex-row gap-8">
                <aside className="w-full md:w-64 flex-shrink-0">
                    <div className="sticky top-24">
                        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Source Groups</h3>
                        <nav className="space-y-1">
                            {news_sources.source_groups.map((group: SourceGroup) => (
                                <a
                                    key={group.group_name}
                                    href={`#${group.group_name}`}
                                    onClick={(e) => { e.preventDefault(); handleNavClick(group.group_name); }}
                                    className={`block px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                                        activeGroup === group.group_name
                                            ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200/50 dark:hover:bg-gray-700/50'
                                    }`}
                                >
                                    {group.group_name}
                                </a>
                            ))}
                        </nav>
                    </div>
                </aside>

                <main className="flex-1 space-y-12">
                    {news_sources.source_groups.map((group: SourceGroup) => (
                        <section 
                            key={group.group_name} 
                            id={group.group_name}
                            ref={el => { groupRefs.current[group.group_name] = el; }}
                            className="scroll-mt-20"
                        >
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
                                {group.group_name}
                            </h2>
                            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                                {group.sources.map((source: Source) => (
                                    <SourceCard key={source.name} source={source} />
                                ))}
                            </div>
                        </section>
                    ))}

                    <section className={`scroll-mt-20 grid grid-cols-1 ${news_sources.integration ? 'lg:grid-cols-2' : ''} gap-8 pt-8`}>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
                                <CogIcon className="h-6 w-6 mr-2 text-blue-600 dark:text-blue-400" />
                                Ingestion Policy
                            </h2>
                             <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
                                <dl className="grid grid-cols-2 gap-x-4 gap-y-6">
                                    <PolicyItem label="Fetch Frequency" value={news_sources.ingestion_policy.fetch_frequency} />
                                    <PolicyItem label="Method" value={news_sources.ingestion_policy.method} />
                                    <PolicyItem label="Content Types" value={news_sources.ingestion_policy.content_types.join(', ')} />
                                    <PolicyItem label="Language Detection" value={news_sources.ingestion_policy.language_detection} />
                                    <PolicyItem label="Robots.txt Respect" value={news_sources.ingestion_policy.robots_txt_respect} />
                                    <PolicyItem label="License Check" value={news_sources.ingestion_policy.license_check} />
                                </dl>
                            </div>
                        </div>
                        { news_sources.integration && (
                             <div>
                                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
                                    <CodeIcon className="h-6 w-6 mr-2 text-blue-600 dark:text-blue-400" />
                                    Integration Details
                                </h2>
                                <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
                                    <dl className="grid grid-cols-1 gap-y-6">
                                        <PolicyItem label="Dashboard Section" value={news_sources.integration.dashboard_section} />
                                        <PolicyItem label="API Endpoint" value={news_sources.integration.api_endpoint} />
                                        <PolicyItem label="Display Fields" value={news_sources.integration.display_fields.join(', ')} />
                                        <PolicyItem label="Alert Triggers" value={news_sources.integration.alert_rules.trigger_on.join(', ')} />
                                    </dl>
                                </div>
                            </div>
                        )}
                    </section>
                </main>
            </div>
        </div>
    );
};
