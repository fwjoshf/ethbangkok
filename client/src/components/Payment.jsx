import React, { useState } from "react";

const Payment = () => {
  const [amount, setAmount] = useState(0);
  const [transactionHash, setTransactionHash] = useState(null); // For storing transaction hash

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Simulate payment processing and getting a transaction hash
      const simulatedTxHash = "0x123456789abcdef123456789abcdef123456789abcdef123456789abcdef1234"; // Replace with actual tx hash from backend
      console.log(`Thanks for your contribution:\n${amount} ETH`);
      
      // Reset amount and store transaction hash
      setTransactionHash(simulatedTxHash);
      setAmount(0);
    } catch (error) {
      console.error("Payment failed:", error);
    }
  };

  return (
    <div className="mt-10">
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="amount"
          >
            Choose Amount
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min={0.01}
            step={0.01}
            required
          />
        </div>
        <div className="flex items-center justify-center">
          <button
            type="submit"
            className="bg-teal-400 hover:bg-teal-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Send
          </button>
        </div>
      </form>

      {transactionHash && (
        <div className="mt-6 text-center">
          <p className="text-gray-700">
            Thank you for your contribution! You can view the transaction below:
          </p>
          <a
            href={`https://blockscout.com/eth/mainnet/tx/${transactionHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            View Transaction on Blockscout
          </a>
        </div>
      )}
    </div>
  );
};

export default Payment;
