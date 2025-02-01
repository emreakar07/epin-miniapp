import React, { useEffect, useState } from 'react';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { beginCell, toNano } from '@ton/core';
import WebApp from '@twa-dev/sdk';
import { handleTransactionError } from '../utilities/errors';
import { CryptoUtils } from '../utilities/cryptoUtils';
import { Validation } from '../utilities/validation';

const PaymentForm = () => {
  const [tonConnectUI] = useTonConnectUI();
  const [amount, setAmount] = useState('0');
  const [amountUSD, setAmountUSD] = useState<string>('0');
  const [orderId, setOrderId] = useState('');
  const [userId, setUserId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [recipientAddress, setRecipientAddress] = useState('');

  // TON -> USD dönüşümü
  const convertTONtoUSD = async (tonAmount: string) => {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=the-open-network&vs_currencies=usd');
      const data = await response.json();
      const tonPrice = data['the-open-network'].usd;
      const nanoTonAmount = Number(tonAmount) / 1e9; // nanoTON -> TON
      const usdAmount = (nanoTonAmount * tonPrice).toFixed(2);
      setAmountUSD(usdAmount);
    } catch (error) {
      console.error('Fiyat dönüşüm hatası:', error);
    }
  };

  // URL'den parametreleri oku
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const newAmount = params.get('amount') || '0';
    setAmount(newAmount);
    convertTONtoUSD(newAmount);
    setOrderId(params.get('orderId') || '');
    setUserId(params.get('userId') || '');
    setRecipientAddress(params.get('address') || '');  // Adresi URL'den al
  }, []);

  // Wallet bağlantı durumu
  useEffect(() => {
    const unsubscribe = tonConnectUI.onStatusChange((wallet) => {
      setIsConnected(!!wallet);
    });
    return () => unsubscribe();
  }, [tonConnectUI]);

  // Ödeme işlemi
  const handlePayment = async () => {
    setIsLoading(true);
    try {
      // Validasyonlar
      if (!Validation.validateAddress(recipientAddress).isValid) {
        throw new Error('Geçersiz alıcı adresi');
      }
      
      const nanoAmount = CryptoUtils.toSafeNano(amount);
      if (nanoAmount <= 0n) {
        throw new Error('Minimum gönderim: 0.01 TON');
      }

      // Transaction
      const tx = {
        validUntil: Math.floor(Date.now() / 1000) + 600,
        messages: [{
          address: recipientAddress,
          amount: nanoAmount.toString(),
          payload: beginCell()
            .storeUint(0, 32)
            .storeStringTail(JSON.stringify({ orderId, userId }))
            .endCell()
            .toBoc()
            .toString('base64url')
        }]
      };

      // İşlemi gönder
      const result = await tonConnectUI.sendTransaction(tx);
      
      if (result.boc) {
        WebApp.close();
      }
    } catch (error) {
      console.error('Ödeme hatası:', error);
      // Yönlendirme kaldırıldı, bunun yerine:
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('İşlem sırasında bir hata oluştu');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="payment-container">
      <div className="payment-details">
        <div className="detail-row">
          <span>Miktar:</span>
          <span>{Number(amount) / 1e9} TON (≈ ${amountUSD})</span>
        </div>
        <div className="detail-row">
          <span>Alıcı:</span>
          <span>{recipientAddress.slice(0, 6)}...{recipientAddress.slice(-4)}</span>
        </div>
      </div>

      <button
        onClick={handlePayment}
        disabled={!isConnected || isLoading}
        style={{ backgroundColor: WebApp.themeParams.button_color }}
      >
        {isLoading ? 'İşleniyor...' : 'Onayla ve Öde'}
      </button>
    </div>
  );
};

export default PaymentForm;