
import React, { useState, useRef, useEffect } from 'react';
import type { FilterState } from '../types';
import { ALL_COMPANIES, FILTER_OPTIONS, DATE_RANGE_OPTIONS } from '../constants';
import { ChevronDownIcon, FilterIcon, SearchIcon, XIcon, CogIcon } from './Icons';

interface SidebarProps {
  filters: FilterState;
  onFiltersChange: React.Dispatch<React.SetStateAction<FilterState>>;
  onLiveSearch: (query: string) => void;
  onManageKeywords: () => void;
}

const useClickOutside = (ref: React.RefObject<HTMLElement>, handler: () => void) => {
    useEffect(() => {
        const listener = (event: MouseEvent | TouchEvent) => {
            if (!ref.current || ref.current.contains(event.target as Node)) {
                return;
            }
            handler();
        };
        document.addEventListener('mousedown', listener);
        document.addEventListener('touchstart', listener);
        return () => {
            document.removeEventListener('mousedown', listener);
            document.removeEventListener('touchstart', listener);
        };
    }, [ref, handler]);
};

const MultiSelectDropdown: React.FC<{
    options: string[];
    selected: string[];
    onChange: (selected: string[]) => void;
    placeholder: string;
}> = ({ options, selected, onChange, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    useClickOutside(dropdownRef, () => setIsOpen(false));

    const handleSelect = (option: string) => {
        const newSelected = selected.includes(option)
            ? selected.filter(item => item !== option)
            : [...selected, option];
        onChange(newSelected);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm pl-3 pr-10 py-2 text-left focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
                <span className="block truncate">
                    {selected.length > 0 ? `${selected.length} selected` : placeholder}
                </span>
                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                </span>
            </button>
            {isOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                    {options.map(option => (
                        <div
                            key={option}
                            onClick={() => handleSelect(option)}
                            className="cursor-pointer select-none relative py-2 pl-3 pr-9 text-gray-900 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <span className={`block truncate ${selected.includes(option) ? 'font-semibold' : 'font-normal'}`}>{option}</span>
                            {selected.includes(option) && (
                                <span className="text-blue-600 absolute inset-y-0 right-0 flex items-center pr-4">
                                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};


export const Sidebar: React.FC<SidebarProps> = ({ filters, onFiltersChange, onLiveSearch, onManageKeywords }) => {
    const [liveQuery, setLiveQuery] = useState('');

    const handleFilterChange = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
        onFiltersChange(prev => ({ ...prev, [key]: value }));
    };

    const handleLiveSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLiveSearch(liveQuery);
        setLiveQuery('');
    };
    
    const clearFilters = () => {
        onFiltersChange({
            searchTerm: '',
            dateRange: '30',
            jurisdictions: [],
            eventTypes: [],
            therapeuticAreas: [],
            companies: [],
        });
    };

    const hasActiveFilters = filters.searchTerm || filters.dateRange !== '30' || filters.jurisdictions.length > 0 || filters.eventTypes.length > 0 || filters.therapeuticAreas.length > 0 || filters.companies.length > 0;

  return (
    <aside className="w-96 bg-gray-50 dark:bg-gray-800 p-4 border-r border-gray-200 dark:border-gray-700 flex flex-col" style={{ height: 'calc(100vh - 64px)'}}>
        <div className="flex-1 overflow-y-auto pr-2">
            <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                    <SearchIcon className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                    Live Web Search
                </h3>
                <form onSubmit={handleLiveSearchSubmit}>
                    <input
                        type="text"
                        value={liveQuery}
                        onChange={(e) => setLiveQuery(e.target.value)}
                        placeholder="e.g., Stelara biosimilar updates"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button type="submit" className="mt-2 w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm">
                        Search Web
                    </button>
                </form>
            </div>

            <div className="py-4">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-md font-semibold text-gray-900 dark:text-white flex items-center">
                       <FilterIcon className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                       Filter News Feed
                    </h3>
                    {hasActiveFilters && (
                         <button onClick={clearFilters} className="text-xs font-semibold text-blue-600 hover:underline">Clear All</button>
                    )}
                </div>
                <div className="space-y-4 text-sm">
                     <div>
                        <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">Search Term</label>
                        <input
                            type="text"
                            value={filters.searchTerm}
                            onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                            placeholder="Filter by keyword..."
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">Date Range</label>
                        <select
                            value={filters.dateRange}
                            onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                             className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:ring-blue-500 focus:border-blue-500"
                        >
                           {DATE_RANGE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">Jurisdictions</label>
                        <MultiSelectDropdown options={FILTER_OPTIONS.jurisdictions} selected={filters.jurisdictions} onChange={sel => handleFilterChange('jurisdictions', sel)} placeholder="Select jurisdictions..." />
                    </div>
                     <div>
                        <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">Event Types</label>
                        <MultiSelectDropdown options={FILTER_OPTIONS.eventTypes} selected={filters.eventTypes} onChange={sel => handleFilterChange('eventTypes', sel)} placeholder="Select event types..." />
                    </div>
                     <div>
                        <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">Therapeutic Areas</label>
                        <MultiSelectDropdown options={FILTER_OPTIONS.therapeuticAreas} selected={filters.therapeuticAreas} onChange={sel => handleFilterChange('therapeuticAreas', sel)} placeholder="Select areas..." />
                    </div>
                     <div>
                        <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">Companies</label>
                        <MultiSelectDropdown options={ALL_COMPANIES} selected={filters.companies} onChange={sel => handleFilterChange('companies', sel)} placeholder="Select companies..." />
                    </div>
                </div>
            </div>
        </div>
        <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
             <button 
                onClick={onManageKeywords} 
                className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700"
            >
                <CogIcon className="h-5 w-5 mr-2" />
                Manage Keyword Profiles
            </button>
        </div>
    </aside>
  );
};
