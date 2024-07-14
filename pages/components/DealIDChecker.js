import React from 'react';

function DealIDChecker({ checkDealID, dealID }) {
    return (
      <div className="text-center">
        <button
          onClick={checkDealID}
          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Check Deal ID
        </button>
        {dealID && (
          <p className="mt-2 text-blue-600">
            <a href={dealID} target="_blank" rel="noopener noreferrer" className="underline">
              View Deal
            </a>
          </p>
        )}
      </div>
    );
  }

export default DealIDChecker;