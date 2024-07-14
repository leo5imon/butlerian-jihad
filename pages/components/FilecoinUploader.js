import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import lighthouse from '@lighthouse-web3/sdk';
import 'dotenv/config';

const FilecoinUploader = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [uploadResponse, setUploadResponse] = useState(null);
  const [error, setError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setError(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    maxFiles: 1
  });

  const handlePublish = async () => {
    if (!file) {
      setError('Please select a file first.');
      return;
    }
    setIsUploading(true);
    setError(null);
    try {
      const apiKey = process.env.LIGHTHOUSE_API_KEY;
      const buffer = await file.arrayBuffer();
      const response = await lighthouse.uploadBuffer(
        new Uint8Array(buffer),
        apiKey
      );
      console.log('Upload response:', response);
      setUploadResponse(response);
      onUploadSuccess(response);
    } catch (err) {
      console.error('Lighthouse SDK error:', err);
      setError(`Error uploading file: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-semibold text-center mb-6">Proof Uploader</h1>
            
            <div
              {...getRootProps()}
              className={`p-10 border-2 border-dashed rounded-lg text-center cursor-pointer ${
                isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
              }`}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p className="text-blue-500">Drop the file here ...</p>
              ) : (
                <p className="text-gray-500">Drag 'n' drop your .json here, or click to select it.</p>
              )}
            </div>
            
            {file && (
              <div className="mt-4">
                <h4 className="text-lg font-semibold mb-2">Selected :</h4>
                <p className="text-sm text-gray-600">
                  {file.name} - {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            )}
            
            <button
              onClick={handlePublish}
              disabled={isUploading}
              className={`mt-6 w-full py-2 px-4 rounded-lg text-white transition duration-200 ${
                isUploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {isUploading ? 'Uploading...' : 'Publish to Filecoin'}
            </button>
            
            {error && (
              <p className="mt-4 text-red-500">{error}</p>
            )}
            
            {uploadResponse && (
              <div className="mt-4">
                <h4 className="text-lg font-semibold mb-2">Upload Response:</h4>
                <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
                  {JSON.stringify(uploadResponse, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilecoinUploader;