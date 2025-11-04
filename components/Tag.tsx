
import React from 'react';

interface TagProps {
  color?: string;
  children: React.ReactNode;
}

export const Tag: React.FC<TagProps> = ({ color = 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300', children }) => {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
      {children}
    </span>
  );
};
