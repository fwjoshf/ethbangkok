import React, { useState, useEffect } from "react";

const getBlockscoutWalletLink = (walletAddress) =>
  `https://blockscout.com/eth/mainnet/address/${walletAddress}`;

export const Header = () => {
  const [walletAddress, setWalletAddress] = useState("");

  useEffect(() => {
    const fetchWalletAddress = async () => {
      const connectedWallet = "0x1234567890abcdef1234567890abcdef12345678"; // Example address
      setWalletAddress(connectedWallet);
    };

    fetchWalletAddress();
  }, []);

  return (
    <div
      style={{
        padding: "1rem",
        backgroundColor: "#f5f5f5",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <h1>NeedFund</h1>
      <div>
        {walletAddress ? (
          <a
            href={getBlockscoutWalletLink(walletAddress)}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none", color: "#007bff" }}
          >
            View Wallet on Blockscout
          </a>
        ) : (
          <span>No Wallet Connected</span>
        )}
      </div>
    </div>
  );
};

export default Header;
