import React from 'react';
import { TonConnectButton } from '@tonconnect/ui-react';
import WebApp from '@twa-dev/sdk';

const WalletConnector = () => {
  return (
    <div className="wallet-connector">
      <TonConnectButton 
        className="connect-btn"
        style={{
          backgroundColor: WebApp.themeParams.button_color,
          color: WebApp.themeParams.button_text_color
        }}
      />
    </div>
  );
};

export default WalletConnector;