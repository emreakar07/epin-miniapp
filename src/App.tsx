import React, { useEffect } from 'react';
import { TonConnectUIProvider, THEME } from '@tonconnect/ui-react';
import WalletConnector from '@components/WalletConnector';
import PaymentForm from '@components/PaymentForm';
import WebApp from '@twa-dev/sdk';
import './styles/App.css';

const manifestUrl = 'https://epin-miniapp.vercel.app/tonconnect-manifest.json' as `${string}://${string}`;
const returnUrl = 'https://epin-miniapp.vercel.app' as `${string}://${string}`;

const App = () => {
  useEffect(() => {
    const hash = window.location.hash.substring(1);
    if (hash.startsWith('ton://')) {
      localStorage.setItem('paymentData', hash);
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, []);

  return (
    <TonConnectUIProvider
      manifestUrl={manifestUrl}
      restoreConnection
      actionsConfiguration={{
        twaReturnUrl: returnUrl,
        skipRedirectToWallet: "always",
        returnStrategy: "back"
      }}
      uiPreferences={{
        theme: WebApp.colorScheme === 'dark' ? THEME.DARK : THEME.LIGHT
      }}
    >
      <div className="app-container">
        <h1>EPIN TON Ödeme Ağ Geçidi</h1>
        <WalletConnector />
        <PaymentForm />
      </div>
    </TonConnectUIProvider>
  );
};

export default App;