import React from 'react';
import { DnaIcon, DatabaseIcon, RssIcon, ChartBarIcon } from './Icons';

interface HeaderProps {
    currentView: 'feed' | 'sources' | 'dashboard';
    onNavigate: (view: 'feed' | 'sources' | 'dashboard') => void;
}

const NavButton: React.FC<{
    isActive: boolean;
    onClick: () => void;
    icon: React.ReactNode;
    label: string;
}> = ({ isActive, onClick, icon, label }) => {
    const activeClasses = "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300";
    const inactiveClasses = "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100";
    return (
        <button
            onClick={onClick}
            className={`flex items-center px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 ${isActive ? activeClasses : inactiveClasses}`}
        >
            {icon}
            <span className="ml-2">{label}</span>
        </button>
    );
};


export const Header: React.FC<HeaderProps> = ({ currentView, onNavigate }) => {
  return (
    <header className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-20">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <DnaIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <h1 className="ml-3 text-2xl font-bold text-gray-800 dark:text-gray-200 tracking-tight">
              Biosimilar Monitoring Agent
            </h1>
          </div>
          <nav className="flex items-center space-x-2">
             <NavButton 
                isActive={currentView === 'feed'}
                onClick={() => onNavigate('feed')}
                icon={<RssIcon className="h-5 w-5" />}
                label="News Feed"
             />
              <NavButton 
                isActive={currentView === 'dashboard'}
                onClick={() => onNavigate('dashboard')}
                icon={<ChartBarIcon className="h-5 w-5" />}
                label="Dashboard"
             />
             <NavButton 
                isActive={currentView === 'sources'}
                onClick={() => onNavigate('sources')}
                icon={<DatabaseIcon className="h-5 w-5" />}
                label="Sources"
             />
          </nav>
        </div>
      </div>
    </header>
  );
};