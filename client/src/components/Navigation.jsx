import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [balance, setBalance] = useState({ hbars: '', usd: '' });
  //const accountId = "0.0.5115325";
  const accountId = process.env.REACT_APP_MY_ACCOUNT_ID;
  console.log("accountId",accountId);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!accountId) {
        console.error('Account ID is not set');
        return;
      }

      try {
        const response = await axios.get(`http://localhost:3000/hedera/balance/${accountId}`);
        setBalance(response.data);
      } catch (error) {
        console.error('Error fetching balance:', error);
      }
    };

    fetchBalance();
  }, [accountId]);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="flex fixed w-full items-center justify-between flex-wrap bg-gradient-to-r from-pink-500 to-orange-500 p-6">
      <Link to="/" className="flex items-center flex-shrink-0 text-white mr-6">
        <span className="font-semibold text-xl tracking-tight">HaveFun(d)</span>
      </Link>
      <div className="block lg:hidden">
        <button
          className="flex items-center px-3 py-2 border rounded text-teal-200 border-teal-400 hover:text-white hover:border-white"
          onClick={handleClick}
        >
          <svg
            className="fill-current h-3 w-3"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
          </svg>
        </button>
      </div>
      <div
        className={`${
          isOpen ? 'block' : 'hidden'
        } w-full block flex-grow lg:flex lg:items-center lg:w-auto`}
      >
        <div className="text-sm lg:flex-grow">
          <Link
            to="/create-campaign"
            className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4"
          >
            Create Campaign
          </Link>
          <Link
            to="/account/1"
            className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4"
          >
            My Account
          </Link>
        </div>
        <div className="text-white text-sm lg:flex lg:items-center lg:space-x-4 mt-4 lg:mt-0">
          <span>Account ID: {accountId}</span>
          <span>HBARs: {balance.hbars}</span>
          <span>USD: {balance.usd}</span>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;