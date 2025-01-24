import React, { useEffect } from 'react';
import { TonConnectUIProvider, THEME } from '@tonconnect/ui-react';
import WalletConnector from '@components/WalletConnector';
import PaymentForm from '@components/PaymentForm';
import WebApp from '@twa-dev/sdk';
import './styles/App.css';

const manifestUrl = 'https://epin-miniapp.vercel.app/tonconnect-manifest.json';

const App = () => {
  useEffect(() => {
    WebApp.ready();
    WebApp.setHeaderColor(WebApp.themeParams.bg_color || '#ffffff');
    
    const hash = window.location.hash.substring(1);
    if (hash.startsWith('ton://')) {
      localStorage.setItem('paymentData', hash);
      window.location.hash = '';
    }
  }, []);

  return (
    <TonConnectUIProvider
      manifestUrl={manifestUrl}
      uiPreferences={{
        theme: WebApp.colorScheme === 'dark' ? THEME.DARK : THEME.LIGHT
      }}
      actionsConfiguration={{
        returnStrategy: 'back',
        twaReturnUrl: 'https://epin-miniapp.vercel.app'
      }}
    >
      <div className="app-container">
        <h1 style={{ color: WebApp.themeParams.text_color }}>
          EPIN TON Ödeme Ağ Geçidi
        </h1>
        <WalletConnector />
        <PaymentForm />
      </div>
    </TonConnectUIProvider>
  );
};

export default App;