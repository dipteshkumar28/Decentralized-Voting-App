import './App.css';
import { useState, useEffect } from 'react';
import { ethers } from "ethers";
import { ContractABI, ContractAddress } from './constants/constants';
import Login from "./components/Login";
import Connected from './components/connected';

function App() {
  const [provider, setprovider] = useState(null);
  const [account, setaccount] = useState(null);
  const [Isconnected, SetIsconnected] = useState(null);
  const [votingStatus, setVotingStatus] = useState(true);
  const [remainingtime, setremainingtime] = useState('');
  const [candidates, setcandidates] = useState([]);
  const [number, setnumber] = useState('');
  const [canvote, setcanvote] = useState(true);

  useEffect(() => {
    getCandidates();
    getRemainingTime();
    getCurrentStatus();
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    }
  });

  async function vote() {
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const contractInstance = new ethers.Contract(
      ContractAddress, ContractABI, signer
    );
    const tx = await contractInstance.vote(number);
    await tx.wait();
    canVote();
  }

  async function canVote() {
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const contractInstance = new ethers.Contract(
      ContractAddress, ContractABI, signer
    );
    const votestatus = await contractInstance.voters(await signer.getAddress());
    setcanvote(votestatus);
  }

  async function getCandidates() {
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const contractInstance = new ethers.Contract(
      ContractAddress, ContractABI, signer
    );
    const candidatesList = await contractInstance.getAllVotesOfCandidate();
    // console.log(candidatesList);
    const formattedCandidates = candidatesList.map((candidates, index) => {
      return {
        index: index,
        name: candidates.name,
        voteCount: Number(candidates.voteCount) // Correct for ethers v6
      }
    });
    setcandidates(formattedCandidates);
  }

  async function getCurrentStatus() {
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const contractInstance = new ethers.Contract(
      ContractAddress, ContractABI, signer
    );
    const status = await contractInstance.getVotingStatus();
    console.log(status);
    setVotingStatus(status);
  }


  async function getRemainingTime() {
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const contractInstance = new ethers.Contract(
      ContractAddress, ContractABI, signer
    );
    const time = await contractInstance.getRemainingTime();
    setremainingtime(parseInt(time, 16));


  }
  function handleAccountsChanged(accounts) {
    if (accounts.length > 0 && account !== accounts[0]) {
      setaccount(accounts[0]);
      canVote();
    } else {
      SetIsconnected(false);
      setaccount(null);
    }
  }

  async function connectToMetamask() {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        setprovider(provider);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setaccount(address);
        console.log("Metamask Connected: " + address);
        SetIsconnected(true);
        canVote();
      } catch (err) {
        console.error(err);
      }
    } else {
      console.error("Metamask is not detected in the browser")
    }
  }
  async function handleNumberChange(e) {
    setnumber(e.target.value);
    
  }
  return (
    <div className="App">
      {Isconnected ? (<Connected 
        account={account}
        candidates={candidates}
        remainingtime={remainingtime}
        number={number}
        handleNumberChange={handleNumberChange}
        voteFunction={vote}
        showButton={canvote} />) : (<Login connectWallet={connectToMetamask} />)}
    </div>
  );
}

export default App;
