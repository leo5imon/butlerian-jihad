import React from 'react';
import FormInput from './FormInput';
import Spinner from 'react-bootstrap/Spinner';

function ProposalForm({ formData, handleChange, handleSubmit, errorMessage, isProposing, txSubmitted }) {
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        {Object.entries(formData).map(([key, value]) => (
          <div key={key}>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={key}>
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id={key}
              type="text"
              value={value}
              onChange={(e) => handleChange(key, e.target.value)}
            />
          </div>
        ))}
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          disabled={isProposing}
        >
          {isProposing ? "Proposing..." : "Submit Proposal"}
        </button>
        {errorMessage && <p className="text-red-500 text-xs italic">{errorMessage}</p>}
        {txSubmitted && <p className="text-green-500 text-xs italic">{txSubmitted}</p>}
      </form>
    );
  }

export default ProposalForm;