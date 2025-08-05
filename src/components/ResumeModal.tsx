import React from 'react';
import { X, Download, Eye } from '@phosphor-icons/react';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateName: string;
  resumeUrl: string;
}

const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose, candidateName, resumeUrl }) => {
  if (!isOpen) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = resumeUrl;
    link.download = `${candidateName.replace(/\s+/g, '-').toLowerCase()}-resume.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-5/6 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Eye className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              {candidateName}'s Resume
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownload}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition"
            >
              <Download className="w-4 h-4 mr-1" />
              Download
            </button>
            <button
              onClick={onClose}
              className="inline-flex items-center p-2 border border-gray-300 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="flex-1 p-4">
          <iframe
            src={`${resumeUrl}#toolbar=0`}
            className="w-full h-full border border-gray-200 rounded-lg"
            title={`${candidateName}'s Resume`}
          />
        </div>
      </div>
    </div>
  );
};

export default ResumeModal; 