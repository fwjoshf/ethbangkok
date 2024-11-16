import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "./index.css";
import { BrowserRouter as Router } from "react-router-dom";

// Define Blockscout link utilities for global usage
export const getBlockscoutTxLink = (txHash) => `https://blockscout.com/eth/mainnet/tx/${txHash}`;
export const getBlockscoutWalletLink = (walletAddress) => `https://blockscout.com/eth/mainnet/address/${walletAddress}`;


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Router basename="crowdfunding">
      <App />
    </Router>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
