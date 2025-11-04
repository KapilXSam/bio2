
import React from 'react';
import type { Item } from '../types';
import { Tag } from './Tag';
import { JURISDICTION_COLORS, EVENT_TYPE_COLORS } from '../constants';
import { ClockIcon, GlobeAltIcon, TagIcon } from './Icons';

interface NewsCardProps {
  item: Item;
  onClick: () => void;
}

const ScoreBar: React.FC<{ score: number, label: string }> = ({ score, label }) => {
  const width = `${score * 100}%`;
  const getColor = (s: number) => {
    if (s > 0.75) return 'bg-green-500';
    if (s > 0.5) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
        <span>{label}</span>
        <span>{(score * 100).toFixed(0)}</span>
      </div>
      <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 w-full">
        <div className={`${getColor(score)} h-1.5 rounded-full`} style={{ width }}></div>
      </div>
    </div>
  );
};

export const NewsCard: React.FC<NewsCardProps> = ({ item, onClick }) => {
  return (
    <div 
      onClick={onClick} 
      className="bg-white dark:bg-gray-900 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer overflow-hidden border border-transparent hover:border-blue-500"
    >
      <div className="p-5">
        <div className="flex flex-wrap gap-2 mb-3">
            <Tag color={JURISDICTION_COLORS[item.jurisdiction] || JURISDICTION_COLORS.Default}>
                <GlobeAltIcon className="h-4 w-4 mr-1.5"/>
                {item.jurisdiction}
            </Tag>
            <Tag color={EVENT_TYPE_COLORS[item.event_type] || EVENT_TYPE_COLORS.Default}>
                <TagIcon className="h-4 w-4 mr-1.5"/>
                {item.event_type.replace(/([A-Z])/g, ' $1').trim()}
            </Tag>
        </div>
        
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2 leading-tight hover:text-blue-600 dark:hover:text-blue-400">
          {item.title}
        </h2>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {item.summary}
        </p>

        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-4">
          <ClockIcon className="h-4 w-4 mr-1.5" />
          <span>{new Date(item.published_at).toLocaleDateString()}</span>
          <span className="mx-2">|</span>
          <span>{item.source_type}</span>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-3 border-t border-gray-200 dark:border-gray-700">
            <ScoreBar score={item.metrics.relevance_score} label="Relevance"/>
            <ScoreBar score={item.metrics.impact_score} label="Impact"/>
            <ScoreBar score={item.metrics.confidence_score} label="Confidence"/>
        </div>
      </div>
    </div>
  );
};
