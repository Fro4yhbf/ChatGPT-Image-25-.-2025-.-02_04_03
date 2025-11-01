
import React from 'react';
import { DocumentFile } from '../types';
import FileTextIcon from './icons/FileTextIcon';

interface FileListProps {
  files: DocumentFile[];
  selectedFile: DocumentFile | null;
  onSelectFile: (file: DocumentFile) => void;
}

const FileList: React.FC<FileListProps> = ({ files, selectedFile, onSelectFile }) => {
  if (files.length === 0) {
    return (
        <div className="mt-4 text-center text-gray-500">
            <p>No files uploaded yet.</p>
        </div>
    );
  }

  return (
    <div className="mt-4 space-y-2">
      {files.map((file) => (
        <button
          key={file.id}
          onClick={() => onSelectFile(file)}
          className={`w-full text-left flex items-center gap-3 p-2 rounded-md transition-colors duration-200 ${
            selectedFile?.id === file.id
              ? 'bg-indigo-600/30 text-indigo-300'
              : 'bg-gray-800/50 hover:bg-gray-700/50'
          }`}
        >
          <FileTextIcon className="w-5 h-5 flex-shrink-0 text-gray-400" />
          <span className="truncate text-sm text-gray-200">{file.name}</span>
        </button>
      ))}
    </div>
  );
};

export default FileList;
