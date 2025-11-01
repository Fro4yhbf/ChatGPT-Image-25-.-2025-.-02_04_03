
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ImageGenerator from './components/ImageGenerator';

function App() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'imageGenerator'>('dashboard');

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 font-sans">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      <main className="flex-1 flex flex-col overflow-hidden">
        {currentView === 'dashboard' && <Dashboard />}
        {currentView === 'imageGenerator' && <ImageGenerator />}
      </main>
    </div>
  );
}

export default App;
