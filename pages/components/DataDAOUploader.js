import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import WalletConnector from './WalletConnector';
import ProposalForm from './ProposalForm';
import DealIDChecker from './DealIDChecker';
import { CID } from 'multiformats/cid'

import governorContractABI from "../contractABIs/governorABI.json";
import daoDealClientABI from "../contractABIs/daoDealClientABI.json";

const governorContractAddress = "0xb57724c0cB71C4a9a967c586CcF54d2Da8234028";
const daoDealClientAddress = "0x116de3162285EaD343E9C88b5c5d101596930128";

function DataDAOUploader({ uploadedFile }) {
  const [formData, setFormData] = useState({
    commP: "",
    carLink: "",
    pieceSize: "",
    carSize: "",
    proposalDescription: "Proposal for uploaded file"
  });

  const [errorMessageSubmit, setErrorMessageSubmit] = useState("");
  const [txSubmitted, setTxSubmitted] = useState("");
  const [dealID, setDealID] = useState("");
  const [proposingDeal, setProposingDeal] = useState(false);
  const [network, setNetwork] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [signer, setSigner] = useState(null);
  const [governor, setGovernor] = useState(null);

  useEffect(() => {
    if (uploadedFile) {
      setFormData(prevData => ({
        ...prevData,
        commP: uploadedFile.data.Hash,
        carLink: uploadedFile.data.Name,
        carSize: uploadedFile.data.Size
      }));
    }
  }, [uploadedFile]);

  const handleChange = (field, value) => {
    setFormData(prevData => ({ ...prevData, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessageSubmit("");
    setProposingDeal(true);

    try {
      if (!signer || !governor) {
        throw new Error("Please connect your wallet first");
      }

      const cid = new CID(formData.commP);
      
      const extraParamsV1 = [formData.carLink, formData.carSize, false, false];
      const DealRequestStruct = [
        cid.bytes,
        formData.pieceSize,
        false, // verified deal
        formData.commP,
        520000, // start epoch
        1555200, // end epoch
        0, // storage price per epoch
        0, // provider collateral
        0, // client collateral
        1, // extra params version
        extraParamsV1
      ];
      
      const encodedFunctionCall = daoDealClientABI.encodeFunctionData("makeDealProposal", [DealRequestStruct]);
      const transaction = await governor.propose(
        [daoDealClientAddress],
        [0],
        [encodedFunctionCall],
        formData.proposalDescription
      );
      
      console.log("Proposing deal to DAO...");
      const receipt = await transaction.wait();
      console.log(receipt);
      setTxSubmitted("Transaction submitted! " + receipt.hash);

      governor.on("DealProposalCreate", (id, size, verified, price) => {
        console.log("Deal Proposal Created:", id, size, verified, price);
      });

      console.log("Deal proposed! CID: " + cid);
    } catch (error) {
      console.error("Error submitting proposal:", error);
      setErrorMessageSubmit("Error submitting proposal: " + error.message);
    } finally {
      setProposingDeal(false);
    }
  };

  const checkWalletIsConnected = async () => {
    const { ethereum } = window;
    if (!ethereum) {
      console.log("Make sure you have MetaMask installed!");
      return;
    }

    try {
      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length !== 0) {
        setIsConnected(true);
        console.log("Found an authorized account:", accounts[0]);
        await setupEthereumObjects();
      } else {
        console.log("No authorized account found");
      }
    } catch (error) {
      console.error("Error checking wallet connection:", error);
    }
  };

  const connectWalletHandler = async () => {
    const { ethereum } = window;
    if (!ethereum) {
      alert("Please install MetaMask!");
      return;
    }

    try {
      await ethereum.request({ method: "eth_requestAccounts" });
      console.log("Wallet connected!");
      setIsConnected(true);
      await setupEthereumObjects();
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  const setupEthereumObjects = async () => {
    const { ethereum } = window;
    const provider = new ethers.BrowserProvider(ethereum);
    const newSigner = await provider.getSigner();
    setSigner(newSigner);

    const newGovernor = new ethers.Contract(governorContractAddress, governorContractABI, newSigner);
    setGovernor(newGovernor);

    const network = await provider.getNetwork();
    setNetwork(network.chainId);
  };

  const dealIDHandler = async () => {
    if (!governor) {
      setErrorMessageSubmit("Please connect your wallet first");
      return;
    }

    setDealID("Waiting for acceptance by SP...");
    const cid = new CID(formData.commP);

    const checkDealID = async () => {
      try {
        console.log("Checking for deal ID...");
        const dealID = await governor.pieceDeals(cid.bytes);
        console.log("Deal ID:", dealID);
        if (dealID !== undefined && dealID !== "0") {
          setDealID("https://calibration.filfox.info/en/deal/" + dealID);
          return true;
        }
        return false;
      } catch (error) {
        console.error("Error checking deal ID:", error);
        setErrorMessageSubmit("Error checking deal ID: " + error.message);
        return true;
      }
    };

    const intervalId = setInterval(async () => {
      const isDone = await checkDealID();
      if (isDone) {
        clearInterval(intervalId);
      }
    }, 5000);
  };

  useEffect(() => {
    checkWalletIsConnected();
  }, []);

  return (
    <div className="min-h-screen py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-purple-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-semibold text-center mb-6">Join the REAL Artist cooperative and train your own models.</h1>
            
            {WalletConnector && (
              <WalletConnector 
                connectWallet={connectWalletHandler}
                isConnected={isConnected}
                network={network}
              />
            )}
            
            <div className="mt-8">
              {ProposalForm && (
                <ProposalForm 
                  formData={formData}
                  handleChange={handleChange}
                  handleSubmit={handleSubmit}
                  errorMessage={errorMessageSubmit}
                  isProposing={proposingDeal}
                  txSubmitted={txSubmitted}
                />
              )}
            </div>
            
            <div className="mt-8">
              {DealIDChecker && (
                <DealIDChecker 
                  checkDealID={dealIDHandler}
                  dealID={dealID}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DataDAOUploader;