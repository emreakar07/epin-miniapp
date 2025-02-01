import React, { useEffect } from 'react';
import { TonConnectUIProvider, THEME } from '@tonconnect/ui-react';
import WebApp from '@twa-dev/sdk';
import PaymentForm from './components/PaymentForm';
import './styles/App.css';

const manifestUrl = 'https://epin-miniapp.vercel.app/tonconnect-manifest.json' as `https://${string}`;

const App = () => {
  useEffect(() => {
    WebApp.expand();
  }, []);

  return (
    <TonConnectUIProvider
      manifestUrl={manifestUrl}
      restoreConnection
      actionsConfiguration={{
        twaReturnUrl: 'https://epin-miniapp.vercel.app',
        skipRedirectToWallet: "always",
        returnStrategy: "back"
      }}
      uiPreferences={{
        theme: WebApp.colorScheme === 'dark' ? THEME.DARK : THEME.LIGHT
      }}
    >
      <div className="app-container">
        <h1>EPIN TON Ödeme Ağ Geçidi</h1>
        <PaymentForm />
      </div>
    </TonConnectUIProvider>
  );
};

export default App;