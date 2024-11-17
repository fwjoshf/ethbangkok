import React from "react";
import { useParams } from "react-router-dom";
import { sampleData } from "../assets";
import CoinbaseOnramp from "../components/CoinbaseOnramp"; 

const Account = () => {
  const { id } = useParams();
  const data = sampleData.find((d) => d.id === Number(id));
  console.log(data);

  const handleOnrampSuccess = (transaction) => {
    console.log("Fiat-to-Crypto Transaction Successful:", transaction);
    alert("Your wallet has been funded successfully!");
  };

  return (
    <div className="pt-28 text-center">
      <h1 className="text-3xl font-bold">{data.businessName}</h1>
      <p className="mt-4 text-gray-600">Public ID: {data.accountId}</p>

      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Fund Your Wallet</h2>
        <p className="text-gray-500 mb-6">
          Use fiat currency to fund your crypto wallet directly.
        </p>
        <CoinbaseOnramp
          onSuccess={handleOnrampSuccess} // Callback for successful funding
        />
      </div>
    </div>
  );
};

export default Account;
