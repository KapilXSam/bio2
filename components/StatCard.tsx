import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => {
  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md flex items-center space-x-4">
      <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full text-blue-600 dark:text-blue-300">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white truncate">{value}</p>
      </div>
    </div>
  );
};
