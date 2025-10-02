import React, { useState } from 'react';
import { Upload, FileText, X, CheckCircle } from 'lucide-react';
import type { User } from '../App';

interface UploadPageProps {
  onUpload: (file: File) => void;
  user: User | null;
}

const UploadPage: React.FC<UploadPageProps> = ({ onUpload, user }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file: File) => {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ];

    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a PDF or DOCX file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setError('File size must be less than 10MB');
      return;
    }

    setError('');
    setUploadedFile(file);
  };

  const removeFile = () => {
    setUploadedFile(null);
    setError('');
  };

  const processUpload = () => {
    if (!uploadedFile) return;
    
    setUploading(true);
    // Simulate upload processing
    setTimeout(() => {
      setUploading(false);
      onUpload(uploadedFile);
    }, 2000);
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Upload Your Resume
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Upload your resume and let Folio extract and organize your professional information automatically.
            We support PDF and DOCX formats.
          </p>
          {user && (
            <p className="text-sm text-cyan-600 mt-2">
              Welcome, {user.name || user.email}
            </p>
          )}
        </div>

        {/* Upload Area */}
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          {!uploadedFile ? (
            <div
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200 ${
                dragActive
                  ? 'border-cyan-400 bg-cyan-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center gap-4">
                <div className={`p-4 rounded-full ${
                  dragActive ? 'bg-cyan-100' : 'bg-gray-100'
                }`}>
                  <Upload className={`w-8 h-8 ${
                    dragActive ? 'text-cyan-600' : 'text-gray-400'
                  }`} />
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Drag and drop your resume here
                  </h3>
                  <p className="text-gray-600 mb-4">
                    or click to browse files
                  </p>
                  
                  <label className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-teal-500 text-white px-6 py-3 rounded-lg font-medium hover:from-cyan-600 hover:to-teal-600 transition-all duration-200 cursor-pointer">
                    <Upload className="w-5 h-5" />
                    Choose File
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.docx,.doc"
                      onChange={handleFileInput}
                    />
                  </label>
                </div>

                <div className="text-sm text-gray-500">
                  Supported formats: PDF, DOCX (max 10MB)
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="inline-flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <div className="text-left">
                  <div className="font-medium text-green-900">File uploaded successfully</div>
                  <div className="text-sm text-green-700">{uploadedFile.name}</div>
                </div>
                <button
                  onClick={removeFile}
                  className="ml-4 p-1 hover:bg-green-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-green-600" />
                </button>
              </div>

              <div className="flex items-center justify-center gap-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <FileText className="w-5 h-5" />
                  <span>{uploadedFile.name}</span>
                  <span className="text-sm">
                    ({(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
              </div>

              <button
                onClick={processUpload}
                disabled={uploading}
                className="mt-6 inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-teal-500 text-white px-8 py-3 rounded-lg font-medium hover:from-cyan-600 hover:to-teal-600 transition-all duration-200 disabled:opacity-50"
              >
                {uploading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <FileText className="w-5 h-5" />
                    Parse Resume
                  </>
                )}
              </button>
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm text-center">
              {error}
            </div>
          )}
        </div>

        {/* Features Preview */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Upload className="w-6 h-6 text-cyan-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Smart Parsing</h3>
            <p className="text-gray-600 text-sm">
              Advanced AI extracts your experience, education, and skills automatically
            </p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Easy Editing</h3>
            <p className="text-gray-600 text-sm">
              Review and edit extracted information with our intuitive interface
            </p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Portfolio Ready</h3>
            <p className="text-gray-600 text-sm">
              Transform your resume into a beautiful, professional portfolio
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;