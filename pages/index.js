import React, { useState } from 'react';
import FilecoinUploader from './components/FilecoinUploader';
import DataDAOUploader from './components/DataDAOUploader';

function App() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [currentStep, setCurrentStep] = useState('upload');

  const handleUploadSuccess = (response) => {
    setUploadedFile(response);
    setCurrentStep('propose');
  };

  return (
    <div className="min-h-screen bg-gray-800 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            {currentStep === 'upload' ? (
              <>
                <h1 className="text-2xl font-semibold text-center mb-6">Publish your TLS Notary proof of Instagram ownership to Filecoin</h1>
                <FilecoinUploader onUploadSuccess={handleUploadSuccess} />
              </>
            ) : (
              <>
                <h1 className="text-2xl font-semibold text-center mb-6">Join your own DAO</h1>
                <DataDAOUploader uploadedFile={uploadedFile} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;