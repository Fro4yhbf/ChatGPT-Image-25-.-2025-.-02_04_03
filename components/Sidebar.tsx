
import React from 'react';
import FileTextIcon from './icons/FileTextIcon';
import ImageIcon from './icons/ImageIcon';
import SparklesIcon from './icons/SparklesIcon';

interface SidebarProps {
  currentView: 'dashboard' | 'imageGenerator';
  setCurrentView: (view: 'dashboard' | 'imageGenerator') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
  const navItems = [
    { id: 'dashboard', icon: FileTextIcon, label: 'My Files' },
    { id: 'imageGenerator', icon: ImageIcon, label: 'Image Studio' },
  ];

  return (
    <div className="w-64 bg-gray-900/70 backdrop-blur-sm border-r border-gray-700/50 flex flex-col p-4">
      <div className="flex items-center gap-2 mb-8 px-2">
        <SparklesIcon className="w-8 h-8 text-indigo-400" />
        <h1 className="text-xl font-bold text-gray-100">AI Study Platform</h1>
      </div>
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id as 'dashboard' | 'imageGenerator')}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
              currentView === item.id
                ? 'bg-indigo-600 text-white'
                : 'text-gray-400 hover:bg-gray-700/50 hover:text-gray-100'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
