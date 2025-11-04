
import React from 'react';
import { keywordProfiles } from '../data/keywordProfiles';
import type { KeywordProfile } from '../types';
import { XIcon, TagIcon, PencilIcon, TrashIcon, PlusIcon } from './Icons';

interface KeywordManagerModalProps {
  onClose: () => void;
}

export const KeywordManagerModal: React.FC<KeywordManagerModalProps> = ({ onClose }) => {
  // In a real app, this state would be managed via props or a state manager
  const [profiles] = React.useState<KeywordProfile[]>(keywordProfiles);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Keyword Profile Manager</h2>
          <div className="flex items-center space-x-2">
             <button className="flex items-center px-3 py-1.5 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors">
                <PlusIcon className="h-4 w-4 mr-1.5"/>
                New Profile
             </button>
             <button onClick={onClose} className="p-1 rounded-full text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700">
                <XIcon className="h-6 w-6" />
             </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto">
          <div className="space-y-4">
            {profiles.map(profile => (
              <div key={profile.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">{profile.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{profile.description}</p>
                  </div>
                  <div className="flex space-x-2 flex-shrink-0 ml-4">
                    <button className="p-1.5 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button className="p-1.5 text-gray-500 hover:text-red-600 dark:hover:text-red-400 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {profile.keywords.map(keyword => (
                    <span key={keyword} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                      <TagIcon className="h-3 w-3 mr-1" />
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
