import React, { useState } from 'react';
import axios from 'axios';

const CardPayment = ({ accountId }) => {
  const [formData, setFormData] = useState({
    number: '4007400000000007',
    cvc: '123',
    expMonth: 12,
    expYear: 2024,
    billingDetails: {
      name: 'John Doe',
      city: 'San Francisco',
      country: 'US',
      line1: '123 Main St',
      postalCode: '94103',
      district: 'CA'
    },
    amount: 5
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('billingDetails')) {
      const [_, key] = name.split('.');
      setFormData((prevState) => ({
        ...prevState,
        billingDetails: {
          ...prevState.billingDetails,
          [key]: value
        }
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const metadata = {
      email: 'john.doe@example.com',
      sessionId: 'hashed_session_id',
      ipAddress: '192.0.2.1'
    };
    const data = { ...formData, recipientAccountId: accountId, metadata };
    
    console.log("req.body",data)

    try {
      const response = await axios.post('http://localhost:3000/circle/anonymousDonate', data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const { transactionHash, transactionId } = JSON.parse(response.data.transactionId);
      const newWindowsLink = `https://hashscan.io/testnet/transaction/${transactionHash}`;
      window.open(newWindowsLink, '_blank');
      //alert(`Transaction Hash: ${transactionHash}\nTransaction ID: ${transactionId}`);
    } catch (error) {
      console.error('Error making payment:', error);
      alert('Payment failed. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 max-h-96 overflow-y-auto">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="number">
          Card Number
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          name="number"
          id="number"
          type="text"
          placeholder="Card Number"
          value={formData.number}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cvc">
          CVC
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          name="cvc"
          id="cvc"
          type="text"
          placeholder="CVC"
          value={formData.cvc}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="expMonth">
          Expiry Month
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          name="expMonth"
          id="expMonth"
          type="number"
          placeholder="Expiry Month"
          value={formData.expMonth}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="expYear">
          Expiry Year
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          name="expYear"
          id="expYear"
          type="number"
          placeholder="Expiry Year"
          value={formData.expYear}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="billingDetails.name">
          Billing Name
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          name="billingDetails.name"
          id="billingDetails.name"
          type="text"
          placeholder="Billing Name"
          value={formData.billingDetails.name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="billingDetails.city">
          City
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          name="billingDetails.city"
          id="billingDetails.city"
          type="text"
          placeholder="City"
          value={formData.billingDetails.city}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="billingDetails.country">
          Country
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          name="billingDetails.country"
          id="billingDetails.country"
          type="text"
          placeholder="Country"
          value={formData.billingDetails.country}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="billingDetails.line1">
          Address Line 1
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          name="billingDetails.line1"
          id="billingDetails.line1"
          type="text"
          placeholder="Address Line 1"
          value={formData.billingDetails.line1}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="billingDetails.postalCode">
          Postal Code
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          name="billingDetails.postalCode"
          id="billingDetails.postalCode"
          type="text"
          placeholder="Postal Code"
          value={formData.billingDetails.postalCode}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="billingDetails.district">
          District
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          name="billingDetails.district"
          id="billingDetails.district"
          type="text"
          placeholder="District"
          value={formData.billingDetails.district}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
          Amount
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          name="amount"
          id="amount"
          type="number"
          placeholder="Amount"
          value={formData.amount}
          onChange={handleChange}
          required
        />
      </div>
      <div className="flex items-center justify-between">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default CardPayment;