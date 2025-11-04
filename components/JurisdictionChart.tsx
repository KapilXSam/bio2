import React from 'react';
import { JURISDICTION_COLORS } from '../constants';
import { GlobeAltIcon } from './Icons';

interface ChartData {
  label: string;
  value: number;
}

interface JurisdictionChartProps {
  data: ChartData[];
}

export const JurisdictionChart: React.FC<JurisdictionChartProps> = ({ data }) => {
  const maxValue = Math.max(...data.map(d => d.value), 0);

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md h-full">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
        <GlobeAltIcon className="h-5 w-5 mr-2" />
        News by Jurisdiction
      </h3>
      <div className="space-y-3">
        {data.map(({ label, value }) => {
            const colorClass = JURISDICTION_COLORS[label] || JURISDICTION_COLORS.Default;
            const barColor = colorClass.replace('text-', 'bg-').split(' ')[0]; // Extract bg color
            return (
              <div key={label} className="grid grid-cols-4 items-center gap-2 text-sm">
                <span className="col-span-1 font-medium text-gray-600 dark:text-gray-400 truncate">{label}</span>
                <div className="col-span-3 flex items-center">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                    <div
                      className={`${barColor} h-4 rounded-full text-white text-xs flex items-center justify-end pr-2`}
                      style={{ width: `${(value / maxValue) * 100}%` }}
                    >
                    </div>
                  </div>
                   <span className="ml-3 font-semibold text-gray-800 dark:text-gray-200 w-8 text-right">{value}</span>
                </div>
              </div>
            );
        })}
      </div>
    </div>
  );
};
