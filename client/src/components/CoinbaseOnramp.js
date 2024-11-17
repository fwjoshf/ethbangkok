import React, { useEffect, useState } from 'react';
import { initOnRamp } from '@coinbase/cbpay-js';

const CoinbaseOnramp = ({ onSuccess }) => {
  const [onrampInstance, setOnrampInstance] = useState(null);

  useEffect(() => {
    const options = {
      appId: '<Your App ID>', 
      widgetParameters: {

        addresses: {
          '0xYourEthereumAddress': ['ethereum'],
        },
        assets: ['ETH'],
      },
      onSuccess: (transaction) => {
        console.log('Onramp successful:', transaction);
        if (onSuccess) onSuccess(transaction);
      },
      onExit: () => {
        console.log('Onramp exited');
      },
      onEvent: (event) => {
        console.log('Onramp event:', event);
      },
      experienceLoggedIn: 'popup',
      experienceLoggedOut: 'popup',
      closeOnExit: true,
      closeOnSuccess: true,
    };

    initOnRamp(options, (error, instance) => {
      if (error) {
        console.error('Error initializing Onramp:', error);
      } else {
        setOnrampInstance(instance);
      }
    });

    return () => {
      if (onrampInstance) {
        onrampInstance.destroy();
      }
    };
  }, []);

  const handleOpenOnramp = () => {
    if (onrampInstance) {
      onrampInstance.open();
    }
  };

  return (
    <div>
      <button onClick={handleOpenOnramp} disabled={!onrampInstance}>
        Contribute with Fiat
      </button>
    </div>
  );
};

export default CoinbaseOnramp;
