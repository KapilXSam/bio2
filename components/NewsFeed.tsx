
import React from 'react';
import { NewsCard } from './NewsCard';
import type { Item } from '../types';

interface NewsFeedProps {
  items: Item[];
  onCardClick: (item: Item) => void;
}

export const NewsFeed: React.FC<NewsFeedProps> = ({ items, onCardClick }) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-10 px-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">No News Items Found</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Try adjusting your filters or check back later for new updates.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map(item => (
        <NewsCard key={item.id} item={item} onClick={() => onCardClick(item)} />
      ))}
    </div>
  );
};
