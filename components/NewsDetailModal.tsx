
import React from 'react';
import type { Item } from '../types';
import { XIcon, ExternalLinkIcon, ClipboardListIcon, BeakerIcon, OfficeBuildingIcon, LocationMarkerIcon, HashtagIcon } from './Icons';
import { Tag } from './Tag';

interface NewsDetailModalProps {
  item: Item;
  onClose: () => void;
}

const DetailSection: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode; }> = ({ title, icon, children }) => (
    <div className="py-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 flex items-center">
            {icon}
            <span className="ml-2">{title}</span>
        </h3>
        {children}
    </div>
);

export const NewsDetailModal: React.FC<NewsDetailModalProps> = ({ item, onClose }) => {
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{item.title}</h2>
          <button onClick={onClose} className="p-1 rounded-full text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700">
            <XIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <p className="text-base text-gray-700 dark:text-gray-300 mb-4">{item.summary}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 text-sm">
             <div><strong>Event Type:</strong> {item.event_type.replace(/([A-Z])/g, ' $1').trim()}</div>
             <div><strong>Jurisdiction:</strong> {item.jurisdiction}</div>
             <div><strong>Published:</strong> {new Date(item.published_at).toLocaleString()}</div>
             <div><strong>Source:</strong> {item.source_type}</div>
          </div>
          
          <div className="mt-4">
            <a href={item.source_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline">
              View Original Source <ExternalLinkIcon className="h-4 w-4 ml-1.5"/>
            </a>
          </div>
          
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
              <DetailSection title="Entities" icon={<ClipboardListIcon className="h-5 w-5"/>}>
                  <div className="flex flex-wrap gap-2">
                    {item.entities.molecules_inn.map(m => <Tag key={m} color="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"><BeakerIcon className="h-4 w-4 mr-1"/>{m}</Tag>)}
                    {item.entities.sponsors.map(s => <Tag key={s} color="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"><OfficeBuildingIcon className="h-4 w-4 mr-1"/>{s}</Tag>)}
                    {item.entities.therapeutic_areas.map(t => <Tag key={t} color="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"><HashtagIcon className="h-4 w-4 mr-1"/>{t}</Tag>)}
                  </div>
              </DetailSection>

              <DetailSection title="Metrics" icon={<LocationMarkerIcon className="h-5 w-5"/>}>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">{(item.metrics.relevance_score * 100).toFixed(0)}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Relevance</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{(item.metrics.impact_score * 100).toFixed(0)}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Impact</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{(item.metrics.confidence_score * 100).toFixed(0)}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Confidence</div>
                    </div>
                  </div>
              </DetailSection>

              {item.citations && item.citations.length > 0 && (
                 <DetailSection title="Citations" icon={<ExternalLinkIcon className="h-5 w-5"/>}>
                    <ul className="list-disc list-inside space-y-1">
                        {item.citations.map((cite, index) => (
                            <li key={index} className="text-sm text-gray-600 dark:text-gray-400">
                                <a href={cite} target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-600 dark:text-blue-400 break-all">{cite}</a>
                            </li>
                        ))}
                    </ul>
                 </DetailSection>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};
