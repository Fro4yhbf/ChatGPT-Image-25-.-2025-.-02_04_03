
import React, { useCallback, useState } from 'react';
import UploadCloudIcon from './icons/UploadCloudIcon';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const [isDragging, setIsDragging] = useState(false);

  // Fix: Changed event type from React.DragEvent<HTMLDivElement> to React.DragEvent<HTMLLabelElement> to match the label element.
  const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  // Fix: Changed event type from React.DragEvent<HTMLDivElement> to React.DragEvent<HTMLLabelElement> to match the label element.
  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  // Fix: Changed event type from React.DragEvent<HTMLDivElement> to React.DragEvent<HTMLLabelElement> to match the label element.
  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Fix: Changed event type from React.DragEvent<HTMLDivElement> to React.DragEvent<HTMLLabelElement> to match the label element.
  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileUpload(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  }, [onFileUpload]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileUpload(e.target.files[0]);
    }
  };

  return (
    <div className="p-4 border-2 border-dashed border-gray-600 rounded-lg">
        <label
            htmlFor="file-upload"
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center p-6 text-center rounded-md cursor-pointer transition-colors duration-300 ${isDragging ? 'bg-gray-700' : 'bg-gray-800/50 hover:bg-gray-700/70'}`}
        >
            <UploadCloudIcon className="w-10 h-10 mb-3 text-gray-400" />
            <p className="font-semibold text-gray-200">Click to upload or drag and drop</p>
            <p className="text-xs text-gray-500">PDF, DOCX, JPG, PNG, or TXT (max 100MB)</p>
            <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} />
        </label>
    </div>
  );
};

export default FileUpload;
