// circleClient.js
const axios = require('axios');

async function getPublicKey(apiKey) {
  try {
    const options = {
      method: 'GET',
      url: 'https://api.circle.com/v1/w3s/config/entity/publicKey',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      }
    };

    const response = await axios.request(options);
    const publicKeyData = response.data.data;

    console.log('Public key data:', publicKeyData);

    return publicKeyData;
  } catch (error) {
    console.error('Error getting public key:', error);
    throw error;
  }
}

module.exports = { getPublicKey };