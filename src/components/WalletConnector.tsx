import React from 'react';
import { TonConnectButton } from '@tonconnect/ui-react';

const WalletConnector = () => {
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