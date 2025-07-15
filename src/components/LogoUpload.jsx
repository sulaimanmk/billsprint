
import React, { useState } from 'react';
import { Upload, X, Image } from 'lucide-react';

const LogoUpload = ({ onLogoChange, currentLogo }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0] && files[0].type.startsWith('image/')) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      onLogoChange(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const removeLogo = () => {
    onLogoChange('');
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-3 text-gray-900 dark:text-gray-100">Company Logo</h3>
      
      {currentLogo ? (
        <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
          <img 
            src={currentLogo} 
            alt="Company logo" 
            className="w-full h-full object-contain"
          />
          <button
            onClick={removeLogo}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div
          className={`relative w-full h-32 border-2 border-dashed rounded-lg transition-all duration-300 ${
            dragActive
              ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20'
              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
          } bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
            <Upload className="h-8 w-8 mb-2" />
            <p className="text-sm">Drop logo here or click to upload</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogoUpload;
