import React, { useState, useEffect, Children } from 'react';
import Web3Modal from 'web3modal'; // Ensure this is capitalized for the class
import { ethers } from 'ethers';
import axios from 'axios';
import { useRouter } from 'next/router';

import { VotingAddress, VotingAddressABI } from './constants';

const fetchContract = (signerOrProvider) => 
    new ethers.Contract(VotingAddress, VotingAddressABI, signerOrProvider);

export const VotingContext = React.createContext();

export const VotingProvider = ({ children }) => {
    const votingTitle = 'my first smart contract app';
    const router = useRouter();
    const [currentAccount, setCurrentAccount] = useState('');
    const [candidateLength, setCandidateLength] = useState("");
    const [candidateArray, setCandidateArray] = useState([]);
    const candidateIndex = [];
    const pushCandidate = [];

    const [error, setError] = useState('');
    const highestVote = [];
    const pushVoter = [];
    const [voterArray, setVoterArray] = useState([]);
    const [voterLength, setVoterLength] = useState([]);
    const [voteraddress, setVoteraddress] = useState([]);

    // Check if wallet is connected
    const checkIfWalletIsConnected = async () => {
        if (!window.ethereum) {
            return setError("Please install MetaMask");
        }

        try {
            const accounts = await window.ethereum.request({ method: "eth_accounts" });
            if (accounts.length) {
                setCurrentAccount(accounts[0]);
            } else {
                setError("No accounts found. Please connect your wallet.");
            }
        } catch (error) {
            console.error("Failed to check wallet connection:", error);
            setError("An error occurred while checking wallet connection.");
        }
    };

    // Connect to wallet
    const connectWallet = async () => {
        if (!window.ethereum) {
            return setError("Please install MetaMask");
        }

        try {
            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
            setCurrentAccount(accounts[0]);
        } catch (error) {
            console.error("Failed to connect wallet:", error);
            setError("An error occurred while connecting your wallet.");
        }
    };

    // Upload to IPFS
    const uploadToIPFS = async (file) => {
        if (file) {
            try {
                const formData = new FormData();
                formData.append("file", file);
    
                const response = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
                    headers: {
                        pinata_api_key: process.env.key,
                        pinata_secret_api_key: process.env.secret,
                        "Content-Type": "multipart/form-data",
                    },
                });
    
                // Log the entire response to debug
                console.log(response);
    
                // Check the response structure and extract the IPFS hash
                const ImgHash = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
                return ImgHash;
            } catch (error) {
                console.error("Error uploading file to IPFS", error);
                setError("Failed to upload image to IPFS");
            }
        }
    };

    const uploadToIPFSCandidate = async (file) => {
        if (file) {
            try {
                const formData = new FormData();
                formData.append("file", file);
    
                const response = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
                    headers: {
                        pinata_api_key: process.env.key,
                        pinata_secret_api_key: process.env.secret,
                        "Content-Type": "multipart/form-data",
                    },
                });
    
                // Log the entire response to debug
                console.log(response);
    
                // Check the response structure and extract the IPFS hash
                const ImgHash = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
                return ImgHash;
            } catch (error) {
                console.error("Error uploading file to IPFS", error);
                setError("Failed to upload image to IPFS");
            }
        }
    };

    // Create voter
    const createVoter = async (formInput, fileUrl) => {
        try {
            const { name, address, position } = formInput;
    
            if (!name || !address || !position) {
                return setError("Enter the missing data");
            }
    
            // Connecting to smart contract
            const web3Modal = new Web3Modal(); // Use capital 'W' here
            const connection = await web3Modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const signer = provider.getSigner();
            const contract = fetchContract(signer);
            console.log(contract);
            console.log("contract address : " , contract.address);

    
            const data = JSON.stringify({ name, address, position, image: fileUrl });
                
            const response = await axios.post("https://api.pinata.cloud/pinning/pinJSONToIPFS", data, {
                headers: {
                    pinata_api_key: process.env.key,
                    pinata_secret_api_key: process.env.secret,
                    "Content-Type": "application/json", 
                },
            });
        
            const url = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
            

            const voter = await contract.voterRight(address, name, url, fileUrl);
            voter.wait();
            console.log(voter);
            router.push("/voterList");
    
        } catch (error) {
            console.error("Error in creating voter:", error.response ? error.response.data : error.message);
            setError("Error in creating voter");
        }
    };

    //get voter data
    const getAllVoterData = async () => {
        try {
            const web3Modal = new Web3Modal();
            const connection = await web3Modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const signer = provider.getSigner();
            const contract = fetchContract(signer);
            
            console.log("Contract fetched successfully:", contract);
            console.log("Connected to Contract:", contract.address);

            const voterListData = await contract.getVoterList();
            setVoteraddress(voterListData);
            console.log(voteraddress)

            voterListData.map(async(el)=>{
                const singleVoterData = await contract.getVoterData(el);
                pushVoter.push(singleVoterData);
                console.log(singleVoterData);
            });

            // voter length 

            const voterList = await contract.getVoterLength();
            setVoterLength(voterList.toNumber());


        } catch (error) {
            setError("error in fetching data  : " , error);
        }
            
    };
    
    //give vote 
    const giveVote = async(id)=>{
        try {
            const voterAddress = id.address;
            const voterID = id.id;
            const web3Modal = new Web3Modal();
            const connection = await web3Modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const signer = provider.getSigner();
            const contract = fetchContract(signer);

            const voteredList = await contract.vote(voterAddress , voterID);

        } catch (error) {
            setError(error)
        }
    }

    //candidate part 

    const setCandidate = async (candidateForm, fileUrl, router) => {
        try {
            const { name, address, age } = candidateForm;
    
            if (!name || !address || !age) {
                return setError("Enter the missing data");
            }
    
            // Connecting to smart contract
            const web3Modal = new Web3Modal(); // Use capital 'W' here
            const connection = await web3Modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const signer = provider.getSigner();
            const contract = fetchContract(signer);
            console.log(contract);
            console.log("contract address : " , contract.address);

    
            const data = JSON.stringify({ name, address,  image: fileUrl, age });
                
            const response = await axios.post("https://api.pinata.cloud/pinning/pinJSONToIPFS", data, {
                headers: {
                    pinata_api_key: process.env.key,
                    pinata_secret_api_key: process.env.secret,
                    "Content-Type": "application/json", 
                },
            });
        
            const ipfs = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
            

            const candidate = await contract.setCandidate(address, age, name, fileUrl, ipfs);
            candidate.wait();
            //router.push("/");
    
        } catch (error) {
            console.error("Error in creating candidate:", error.response ? error.response.data : error.message);
            setError("Error in creating candidate");
        }
    };

    // get candidate data 
    const getNewCandidate = async () =>{
        try {
            const web3Modal = new Web3Modal(); // Use capital 'W' here
            const connection = await web3Modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const signer = provider.getSigner();
            const contract = fetchContract(signer);
            console.log(contract);
            console.log("contract address : " , contract.address);
            // all candidate 

            const allCandidate = await contract.getCandidate();
            console.log(allCandidate);

            allCandidate.map(async(el)=>{
                const singleCandidateData = await contract.getCandidateData(el);
                pushCandidate.push(singleCandidateData);
                candidateIndex.push(singleCandidateData[2].toNumber());
            });

            const allCandidateLength = await contract.getCandidateLength();
            setCandidateLength(allCandidateLength.toNumber());

        } catch (error) {
            setError(error);
        }
    }


    useEffect(() => {
        checkIfWalletIsConnected();
        getAllVoterData();
        getNewCandidate();
    }, []);

    return (
        <VotingContext.Provider 
            value={{
                votingTitle,
                checkIfWalletIsConnected,
                connectWallet,
                uploadToIPFS,
                createVoter,
                getAllVoterData,
                currentAccount,
                giveVote,
                uploadToIPFSCandidate,
                error,
                setCandidate,
                getNewCandidate,
                candidateArray,
                voterArray,
                voterLength,
                voteraddress,
                currentAccount,
                candidateArray,
                candidateLength,
                setError, // You can also expose setError if needed
            }}>
            {children}
        </VotingContext.Provider>
    );
};

const Voter = () => {
    return (
        <div>
            {/* Additional voter-related UI can be added here */}
        </div>
    );
};
