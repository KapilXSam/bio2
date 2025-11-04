import React, { useState } from 'react';
import { keywordProfiles } from '../data/keywordProfiles';
import type { KeywordProfile } from '../types';
import { XIcon, TagIcon, PencilIcon, TrashIcon, PlusIcon } from './Icons';

interface KeywordManagerModalProps {
  onClose: () => void;
  customProfiles: KeywordProfile[];
  onUpdateProfiles: (profiles: KeywordProfile[]) => void;
}

export const KeywordManagerModal: React.FC<KeywordManagerModalProps> = ({ onClose, customProfiles, onUpdateProfiles }) => {
  const [newProfileName, setNewProfileName] = useState('');
  const [newProfileDesc, setNewProfileDesc] = useState('');
  const [newProfileKeywords, setNewProfileKeywords] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const allProfiles = [...keywordProfiles, ...customProfiles];

  const handleAddProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfileName.trim() || !newProfileKeywords.trim()) {
        alert("Profile Name and Keywords are required.");
        return;
    }
    const newProfile: KeywordProfile = {
      id: `custom-${Date.now()}`,
      name: newProfileName,
      description: newProfileDesc,
      keywords: newProfileKeywords.split(',').map(k => k.trim()).filter(Boolean),
      isCustom: true,
    };
    onUpdateProfiles([...customProfiles, newProfile]);
    // Reset form
    setNewProfileName('');
    setNewProfileDesc('');
    setNewProfileKeywords('');
    setShowAddForm(false);
  };

  const handleDeleteProfile = (id: string) => {
    if (window.confirm("Are you sure you want to delete this profile?")) {
        onUpdateProfiles(customProfiles.filter(p => p.id !== id));
    }
  };

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
             <button 
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center px-3 py-1.5 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            >
                <PlusIcon className="h-4 w-4 mr-1.5"/>
                {showAddForm ? 'Cancel' : 'New Profile'}
             </button>
             <button onClick={onClose} className="p-1 rounded-full text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700">
                <XIcon className="h-6 w-6" />
             </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto">
            {showAddForm && (
                <form onSubmit={handleAddProfile} className="p-4 border border-blue-200 dark:border-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800/50 mb-6 space-y-3">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">Create New Profile</h3>
                    <input type="text" placeholder="Profile Name*" value={newProfileName} onChange={e => setNewProfileName(e.target.value)} className="w-full p-2 text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"/>
                    <input type="text" placeholder="Description" value={newProfileDesc} onChange={e => setNewProfileDesc(e.target.value)} className="w-full p-2 text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"/>
                    <textarea placeholder="Keywords (comma-separated)*" value={newProfileKeywords} onChange={e => setNewProfileKeywords(e.target.value)} className="w-full p-2 text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600" rows={3}/>
                    <button type="submit" className="w-full px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-md hover:bg-green-700">Save Profile</button>
                </form>
            )}

          <div className="space-y-4">
            {allProfiles.map(profile => (
              <div key={profile.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center">
                        <h3 className="font-semibold text-gray-800 dark:text-gray-200">{profile.name}</h3>
                        {!profile.isCustom && <span className="ml-2 text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full">Default</span>}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{profile.description}</p>
                  </div>
                  <div className="flex space-x-2 flex-shrink-0 ml-4">
                    {profile.isCustom && (
                        <>
                            {/* <button className="p-1.5 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><PencilIcon className="h-4 w-4" /></button> */}
                            <button onClick={() => handleDeleteProfile(profile.id)} className="p-1.5 text-gray-500 hover:text-red-600 dark:hover:text-red-400 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                                <TrashIcon className="h-4 w-4" />
                            </button>
                        </>
                    )}
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