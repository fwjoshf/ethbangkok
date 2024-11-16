const express = require('express')
const router = express.Router()

const {
  Client,

  Hbar,
  TransferTransaction,
} = require('@hashgraph/sdk')
var {Circle, CircleEnvironments} = require('@circle-fin/circle-sdk')
require('dotenv').config()
const {v4: uuidv4} = require('uuid')
const axios = require('axios')
const {readKey, createMessage, encrypt, Key, armor} = require('openpgp')

const myAccountId = process.env.MY_ACCOUNT_ID
const myPrivateKey = process.env.MY_PRIVATE_KEY

//Create your Hedera Testnet client
const client = Client.forTestnet()
client.setOperator(myAccountId, myPrivateKey)
client.setDefaultMaxTransactionFee(new Hbar(100))
client.setMaxQueryPayment(new Hbar(50))

router.post('/convertToHbar', async function (req, res) {
  try {
    const {amount} = req.body
    console.log(req.body)
    const hbars = await getHbarEquivalent(Number(amount))
    if (!hbars) {
      return res.status(404).json({error: 'Hbar equivalent not found'})
    }
    res.json({hbars: hbars})
  } catch (error) {
    res.status(500).json({error: error.message})
  }
})

const crypto = require('crypto');
const secret = crypto.randomBytes(32).toString('hex')
//import { initiateDeveloperControlledWalletsClient } from '@circle-fin/developer-controlled-wallets';
const { getPublicKey } = require('../module/circleClient');

router.post('/encryptCard', async function (req, res) {
  try {
  const {cardNumber, cvc} = req.body
  if (!cardNumber || !cvc) {
    return res.status(400).json({ error: 'Card number and CVC are required' });
  }

  const publicKeyResponse = getPublicKey(process.env.CIRCLE_API_KEY);
  console.log('Public key response:', publicKeyResponse);
  const publicKeyData = publicKeyResponse.data.data;

  console.log('Public key data is:', publicKeyData);

    const encryptedData = await encryptCardData(
      cardNumber,
      cvc,
      publicKeyData.publicKey,
      publicKeyData.keyId
    );
  res.json({encryptedData})
} catch (error) {
  console.error('Error encrypting card details:', error);
  res.status(500).json({ error: error.message });
}
})

// Sample input
// {
//   "number: "4000000000000002",
//   "cvc": "123",
//   "expMonth": 12,
//   "expYear": 2024,
//   "billingDetails": {
//     "name": "John Doe",
//     "city": "San Francisco",
//     "country": "US",
//     "line1": "123 Main St",
//     "postalCode": "94103"
//     "district": "CA"
//   },
//   "metadata": {
//     "email": "john.doe@example.com",
//     "sessionId": "hashed_session_id",
//     "ipAddress": "192.0.2.1"
//   }
// }

router.post('/anonymousDonate', async function (req, res) {
  const circle = new Circle(
    process.env.CIRCLE_API_KEY,
    CircleEnvironments.sandbox, // API base url
  )

  const {
    number,
    cvc,
    expMonth,
    expYear,
    billingDetails,
    metadata,
    amount,
    recipientAccountId,
  } = req.body

  const publicKey = await circle.encryption.getPublicKey()

  const encryptedData = await encryptCardData(
    number,
    cvc,
    publicKey.data.data.publicKey,
    publicKey.data.data.keyId,
  )

  const idempotencyKey = uuidv4()

  const cardDetails = {
    idempotencyKey,
    keyId: publicKey.data.data.keyId,
    encryptedData: encryptedData.encryptedMessage,
    billingDetails,
    expMonth,
    expYear,
    metadata,
  }
  let cardId
  try {
    const response = await circle.cards.createCard(cardDetails)

    cardId = response.data.data.id
  } catch (error) {
    console.log(error)
    res.status(500).json({
      status: 'error',
      message: error.message,
    })
    return
  }

  try {
    const paymentDetails = {
      idempotencyKey: uuidv4(), // use UUID for idempotencyKey
      metadata: metadata,
      amount: {
        amount: amount.toString(),
        currency: 'USD',
      },

      autoCapture: true, // capture the payment automatically
      verification: 'cvv',
      source: {
        id: cardId, // use the cardId retrieved from the createCard endpoint
        type: 'card',
      },
      description: `Anonymous donation of $${amount} to account ${recipientAccountId}`,
    }
    const createPaymentResponse = await circle.payments.createPayment(
      paymentDetails,
    )
  } catch (error) {
    console.log(error)
    res.status(500).json({status: 'error', error: error.toString()})
    return
  }

  // Convert the amount in dollars to Hbars and send to the recipient from our account
  const amountInHbars = await getHbarEquivalent(amount)

  try {
    const transactionId = await new TransferTransaction()
      .addHbarTransfer(myAccountId, -amountInHbars) // sender's account and the amount to send
      .addHbarTransfer(recipientAccountId, amountInHbars) // recipient's account and the amount to receive
      .execute(client)

    const receipt = await transactionId.getReceipt(client)

    res.json({status: 'success', transactionId: transactionId.toString()})
    return
  } catch (err) {
    console.log(err)
    res.status(500).json({status: 'error', error: err.toString()})
    return
  }
})

async function getHbarEquivalent(dollarAmount) {
  dollarAmount = Number(dollarAmount);
  console.log('Dollar amount:', dollarAmount);
  try {
    const response = await axios.get(
      'https://mainnet-public.mirrornode.hedera.com/api/v1/network/exchangerate'
    );
    const data = response.data;
    console.log(data)
    // cent_equivalent represents the number of cents one hbar is worth
    const centEquivalentPerHbar =
      Number(data.current_rate.cent_equivalent) / Number(data.current_rate.hbar_equivalent);
    console.log('Cent equivalent per Hbar:', centEquivalentPerHbar);
    // Convert input dollar amount to cents
    const cents = Number(dollarAmount) * 100;
    console.log('Cents:', cents);
    // Convert input cents to hbars
    let hbars = cents / centEquivalentPerHbar;
    console.log('Hbar equivalent:', hbars);
    // Round to 8 decimal places
    hbars = hbars.toFixed(8);
    console.log('Hbar equivalent2:', hbars);
    return hbars;
  } catch (error) {
    console.error('Error fetching Hbar equivalent:', error);
    return null;
  }
}

async function encryptCardData(number, cvv, publicKey, keyId) {
  // Card data to be encrypted
  const cardData = {
    number,
    cvv,
  }
  // Decode the base64-encoded public key
  const armoredKey = Buffer.from(publicKey, 'base64').toString()

  // Read the public key
  const decodedPublicKey = await readKey({armoredKey})

  // Create a message from the card data
  const message = await createMessage({text: JSON.stringify(cardData)})

  // Encrypt the message with the public key
  const ciphertext = await encrypt({
    message,
    encryptionKeys: decodedPublicKey,
  })

  // Return the encrypted message
  const encryptedData = {
    encryptedMessage: Buffer.from(ciphertext).toString('base64'),
    keyId: keyId,
  }

  return encryptedData
}

module.exports = router
