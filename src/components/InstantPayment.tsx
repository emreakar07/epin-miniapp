import React from 'react';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { toNano } from '@ton/core';
import WebApp from '@twa-dev/sdk';

interface InstantPaymentProps {
  amountUSD: number;
  merchantAddress: string;
}

const InstantPayment = ({ amountUSD, merchantAddress }: InstantPaymentProps) => {
  const [tonConnectUI] = useTonConnectUI();

  const handlePayment = async () => {
    try {
      const tonAmount = await convertUSDtoTON(amountUSD);
      
      const tx = {
        validUntil: Date.now() + 600_000, // 10 dakika
        messages: [{
          address: merchantAddress,
          amount: tonAmount.toString(),
        }]
      };

      const result = await tonConnectUI.sendTransaction(tx);
      
      if (result.boc) {
        WebApp.showAlert('✅ Ödeme başarılı!');
        WebApp.close();
      }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen hata';
        WebApp.showAlert(`❌ Hata: ${errorMessage}`);
    }
  };

  // Gerçek zamanlı kur çevrimi
  const convertUSDtoTON = async (usd: number) => {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=the-open-network&vs_currencies=usd');
    const data = await response.json();
    const tonPrice = data['the-open-network'].usd;
    return toNano((usd / tonPrice).toFixed(9));
  };

  return (
    <button 
      onClick={handlePayment}
      className="instant-payment-button"
    >
      <div className="price-container">
        <span>${amountUSD}</span>
        <span className="ton-equivalent">≈ {((amountUSD / 14.5).toFixed(6))} TON</span>
      </div>
      <span className="fee-text">0 TON Network Fee</span>
    </button>
  );
};

export default InstantPayment;