
import React, { useState, useCallback } from 'react';
import { DocumentFile } from '../types';
import FileUpload from './FileUpload';
import FileList from './FileList';
import DocumentChat from './DocumentChat';
import SparklesIcon from './icons/SparklesIcon';

const Dashboard: React.FC = () => {
  const [files, setFiles] = useState<DocumentFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<DocumentFile | null>(null);

  const handleFileUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const newFile: DocumentFile = {
        id: `${file.name}-${Date.now()}`,
        name: file.name,
        type: file.type,
        content: e.target?.result as string || '',
        file: file,
      };
      setFiles((prevFiles) => [...prevFiles, newFile]);
      setSelectedFile(newFile);
    };
    
    if (file.type.startsWith('text/')) {
        reader.readAsText(file);
    } else {
        // For non-text files, content will be empty.
        // The chat will use the filename as context.
        const newFile: DocumentFile = {
            id: `${file.name}-${Date.now()}`,
            name: file.name,
            type: file.type,
            content: '',
            file: file
        };
        setFiles(prev => [...prev, newFile]);
        setSelectedFile(newFile);
    }

  }, []);

  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 overflow-hidden">
      <div className="lg:col-span-1 flex flex-col bg-gray-800/50 rounded-lg p-4 h-full overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4 text-white">Your Documents</h2>
        <FileUpload onFileUpload={handleFileUpload} />
        <FileList files={files} selectedFile={selectedFile} onSelectFile={setSelectedFile} />
      </div>
      <div className="lg:col-span-2 h-full">
        {selectedFile ? (
          <DocumentChat selectedFile={selectedFile} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full bg-gray-800/50 rounded-lg text-center">
            <SparklesIcon className="w-16 h-16 text-gray-600 mb-4" />
            <h2 className="text-xl font-semibold text-gray-300">Welcome to your AI Assistant</h2>
            <p className="text-gray-500 mt-2">Upload a document to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
