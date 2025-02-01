import React, { useEffect, useState } from 'react';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { beginCell, toNano } from '@ton/core';
import WebApp from '@twa-dev/sdk';
import { handleTransactionError } from '@utils/errors';
import { CryptoUtils } from '@utils/cryptoUtils';
import { Validation } from '@utils/validation';

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

      // Payload oluştur
      const payloadCell = beginCell()
        .storeUint(0, 32)
        .storeStringTail(JSON.stringify({ orderId, userId }))
        .endCell();

      // Transaction
      const tx = {
        validUntil: Math.floor(Date.now() / 1000) + 600,
        messages: [{
          address: recipientAddress,
          amount: nanoAmount.toString(),
          payload: payloadCell.toBoc().toString('base64url')
        }]
      };

      // İşlemi gönder
      const result = await tonConnectUI.sendTransaction(tx);
      
      if (result.boc) {
        WebApp.showAlert('✅ Ödeme Başarılı!', WebApp.close);
      }
    } catch (error) {
      const message = handleTransactionError(error);
      WebApp.showAlert(`❌ Hata: ${message}`);
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
        {/* ... diğer detaylar ... */}
      </div>
      <div className="input-group">
        <label>Alıcı Adresi (EQ...):</label>
        <input
          value={recipientAddress}
          onChange={(e) => setRecipientAddress(e.target.value)}
        />
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