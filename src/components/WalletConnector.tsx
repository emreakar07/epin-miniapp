import React, { useEffect } from 'react';
import { TonConnectButton, useTonConnectUI } from '@tonconnect/ui-react';

const WalletConnector = () => {
  const [tonConnectUI] = useTonConnectUI();
  
  useEffect(() => {
    const handleConnectionChange = (wallet: any) => {
      console.log('Wallet connection changed:', wallet);
    };

    const unsubscribe = tonConnectUI.onStatusChange(handleConnectionChange);
    return () => {
      unsubscribe();
    };
  }, [tonConnectUI]);

  return (
    <div className="wallet-connector">
      <TonConnectButton 
        className="connect-button"
        style={{ 
          width: '100%',
          borderRadius: '8px',
          padding: '12px 24px'
        }}
      />
    </div>
  );
};

export default WalletConnector;