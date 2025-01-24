import React, { useEffect } from 'react';
import { TonConnectUIProvider, THEME } from '@tonconnect/ui-react';
import WebApp from '@twa-dev/sdk';
import InstantPayment from './components/InstantPayment';
import './styles/App.css';

const manifestUrl = 'https://yourdomain.com/tonconnect-manifest.json';

const App = () => {
  useEffect(() => {
    WebApp.ready();
    WebApp.setHeaderColor(WebApp.themeParams.bg_color || '#ffffff');
  }, []);

  return (
    <TonConnectUIProvider
      manifestUrl={manifestUrl}
      uiPreferences={{
        theme: WebApp.colorScheme === 'dark' ? THEME.DARK : THEME.LIGHT
      }}
      actionsConfiguration={{
        returnStrategy: 'back',
        twaReturnUrl: 'https://yourdomain.com'
      }}
    >
      <div className="app-container">
        <InstantPayment 
          amountUSD={3.5}
          merchantAddress="EQABC...XYZ"
        />
      </div>
    </TonConnectUIProvider>
  );
};

export default App;