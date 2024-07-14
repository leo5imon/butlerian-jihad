import React from 'react';

function WalletConnector({ connectWallet, isConnected, network }) {
    return (
      <div className="text-center">
        <button
          onClick={connectWallet}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          {isConnected ? "Wallet Connected" : "Connect Wallet"}
        </button>
        {isConnected && (
          <p className="text-green-600 mt-2">Connected to {network} network</p>
        )}
      </div>
    );
  }

export default WalletConnector;