import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { sampleData } from '../assets';
import { Offcanvas } from '../components';
import axios from 'axios';
import CoinbaseOnramp from '../components/CoinbaseOnramp'; 

const SingleProject = () => {
  const { id } = useParams();
  const [currentAmount, setCurrentAmount] = useState();


  const data = sampleData.find((item) => item.id === Number(id));

  useEffect(() => {
    try {
      axios
        .get(`http://localhost:3000/hedera/balance/${data.accountId}`)
        .then(function (response) {
          setCurrentAmount(response.data);
        })
        .catch(function (error) {
          console.error(error);
        });
    } catch (error) {
      console.error(error);
    }
  }, [data.accountId]);


  const handleOnrampSuccess = (transaction) => {
    console.log('Fiat-to-Crypto Transaction Successful:', transaction);
    alert('Thank you for your contribution!');
  };

  return (
    <div className="pt-12 text-center">
      <h1 className="pt-20 mb-3 text-4xl font-extrabold">{data.title}</h1>
      <h2 className="mb-3 text-2xl text-gray-400 italic">
        {data.businessName}
      </h2>
      <div className="flex flex-row justify-center p-5">
        <img
          src={data.image}
          alt="project header"
          className="max-h-96 shadow-md"
        ></img>
      </div>
      <p className="max-w-lg p-3 mx-auto">{data.description}</p>
      <div className="flex flex-row justify-evenly p-10">
        <span className="text-gray-700 text-lg italic">
          Current: ${currentAmount ? currentAmount.usd : ''}
        </span>
        <span className="text-gray-700 italic text-lg">
          Goal: ${data.goalAmount}
        </span>
      </div>
      <div className="flex flex-col justify-center p-10">
        <div className="text-gray-700 text-lg italic">
          Public ID: {data.accountId}
        </div>
        <div className="text-gray-700 text-lg italic">
          <a
            href={`https://hashscan.io/testnet/account/${data.accountId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            View Wallet on hashscan.io
          </a>
        </div>
      </div>
      <div className="flex flex-row justify-between p-10">
        <span className="text-gray-700 italic">Due: {data.due}</span>
        <span className="text-gray-700 italic">{data.location}</span>
      </div>

      {/* Coinbase Onramp Section */}
      <div className="flex flex-col items-center p-10">
        <h2 className="text-2xl font-bold mb-5">Contribute with Fiat</h2>
        <CoinbaseOnramp
          onSuccess={handleOnrampSuccess} 
        />
      </div>

      <Offcanvas data={data} />
    </div>
  );
};

export default SingleProject;
