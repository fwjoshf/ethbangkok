import { Navigation } from './components';
import { Route, Routes } from 'react-router-dom';
import {
  SingleProject,
  Projects,
  CreateProject,
  Signup,
  Login,
  Account,
} from './pages';
//import { config } from './pages/Config';
//import { PublicClientApplication } from '@azure/msal-browser';
import React, { useState, useEffect } from 'react';

function BlockscoutIntegration() {
  const [balance, setBalance] = useState('0');
  const [transactions, setTransactions] = useState([]);
  const walletAddress = '0x1234567890abcdef...'; // Replace with a real wallet address

  useEffect(() => {
    // Fetch wallet balance
    fetchWalletBalance(walletAddress).then(setBalance);

    // Fetch transaction history
    fetchTransactionHistory(walletAddress).then(setTransactions);
  }, []);

  async function fetchWalletBalance(walletAddress) {
    try {
      const response = await fetch(
        `https://blockscout.com/api?module=account&action=balance&address=${walletAddress}`
      );
      const data = await response.json();
      if (data.status === '1') {
        return data.result; // Balance in Wei
      } else {
        console.error('Error fetching balance:', data.message);
        return '0';
      }
    } catch (error) {
      console.error('API Error:', error);
      return '0';
    }
  }

  async function fetchTransactionHistory(walletAddress) {
    try {
      const response = await fetch(
        `https://blockscout.com/api?module=account&action=txlist&address=${walletAddress}`
      );
      const data = await response.json();
      if (data.status === '1') {
        return data.result; // List of transactions
      } else {
        console.error('Error fetching transactions:', data.message);
        return [];
      }
    } catch (error) {
      console.error('API Error:', error);
      return [];
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Blockscout Integration</h1>
      <h2>Wallet Balance</h2>
      <p>{(balance / 1e18).toFixed(4)} ETH</p> {/* Convert Wei to Ether */}

      <h2>Transaction History</h2>
      <ul>
        {transactions.map((tx) => (
          <li key={tx.hash}>
            <a
              href={`https://blockscout.com/eth/mainnet/tx/${tx.hash}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {tx.hash}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <Navigation />
      <Routes>
        <Route path="/" element={<Projects />} />
        <Route path="/create-campaign" element={<CreateProject />} />
        {/* <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} /> */}
        <Route path="/campaign/:id" element={<SingleProject />} />
        <Route path="/account/:id" element={<Account />} />
        {/* New Route for Blockscout Integration */}
        <Route path="/blockscout" element={<BlockscoutIntegration />} />
      </Routes>
    </div>
  );
}

export default App;
