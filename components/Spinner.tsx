
import React from 'react';

export const Spinner: React.FC = () => (
  <div className="flex flex-col items-center justify-center space-y-2">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-t-2 border-blue-600 dark:border-blue-400"></div>
    <p className="text-sm text-gray-500 dark:text-gray-400">Generating latest intelligence...</p>
  </div>
);
