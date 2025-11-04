
import React from 'react';
import { Spinner } from './Spinner';
import type { LiveSearchResult } from '../types';
import { ExternalLinkIcon, SearchIcon } from './Icons';

interface LiveSearchResultsProps {
  result: LiveSearchResult | null;
  isLoading: boolean;
  hasSearched: boolean;
}

export const LiveSearchResults: React.FC<LiveSearchResultsProps> = ({ result, isLoading, hasSearched }) => {
    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-10">
                <Spinner />
            </div>
        );
    }

    if (!hasSearched) {
        return (
             <div className="text-center py-10 px-4">
                <SearchIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">Live Web Search</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Type a query in the sidebar to search the web for the latest information.
                </p>
            </div>
        )
    }

    if (!result || (!result.summary && result.sources.length === 0)) {
        return (
            <div className="text-center py-10 px-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">No Results Found</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Your live search did not return any results. Try a different query.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {result.summary && (
                <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3">AI Summary</h2>
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{result.summary}</p>
                </div>
            )}
            {result.sources.length > 0 && (
                <div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3">Sources</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {result.sources.map((source, index) => (
                            <a 
                                key={index} 
                                href={source.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="block bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700 hover:border-blue-500"
                            >
                                <div className="flex items-start">
                                    <ExternalLinkIcon className="h-5 w-5 text-blue-500 dark:text-blue-400 mt-0.5 mr-3 flex-shrink-0"/>
                                    <div>
                                        <h3 className="font-semibold text-gray-800 dark:text-gray-200 leading-tight">{source.title}</h3>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 break-all">{source.url}</p>
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
