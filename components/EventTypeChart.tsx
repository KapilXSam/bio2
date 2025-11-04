import React from 'react';
import { EVENT_TYPE_COLORS } from '../constants';
import { TagIcon } from './Icons';

interface ChartData {
  label:string;
  value: number;
}

interface EventTypeChartProps {
  data: ChartData[];
}

const colors = [
    'text-blue-500', 'text-green-500', 'text-yellow-500', 
    'text-purple-500', 'text-pink-500', 'text-indigo-500', 'text-red-500'
];

export const EventTypeChart: React.FC<EventTypeChartProps> = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let accumulated = 0;

  const chartData = data.slice(0, 7).map((item, index) => {
    const percentage = (item.value / total) * 100;
    const strokeDashoffset = 100 - accumulated;
    accumulated += percentage;
    return {
      ...item,
      percentage,
      strokeDasharray: `${percentage} ${100 - percentage}`,
      strokeDashoffset,
      color: colors[index % colors.length],
    };
  });

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md h-full">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
        <TagIcon className="h-5 w-5 mr-2" />
        Event Type Distribution
      </h3>
      <div className="grid grid-cols-2 gap-4 items-center">
        <div className="relative flex justify-center items-center">
          <svg viewBox="0 0 40 40" className="w-full h-full transform -rotate-90">
            <circle cx="20" cy="20" r="15.9155" className="stroke-current text-gray-200 dark:text-gray-700" strokeWidth="4" fill="transparent" />
            {chartData.map((item, index) => (
              <circle
                key={index}
                cx="20"
                cy="20"
                r="15.9155"
                className={`stroke-current ${item.color}`}
                strokeWidth="4"
                fill="transparent"
                strokeDasharray={item.strokeDasharray}
                strokeDashoffset={item.strokeDashoffset}
              />
            ))}
          </svg>
           <div className="absolute flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-gray-800 dark:text-gray-200">{total}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">Total</span>
            </div>
        </div>
        <div className="space-y-2">
          {chartData.map((item, index) => (
            <div key={index} className="flex items-center text-sm">
              <span className={`w-3 h-3 rounded-full mr-2 ${item.color.replace('text-', 'bg-')}`}></span>
              <span className="text-gray-600 dark:text-gray-400 truncate flex-1">{item.label}</span>
              <span className="font-semibold text-gray-800 dark:text-gray-200 ml-2">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
