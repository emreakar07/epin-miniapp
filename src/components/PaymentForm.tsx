import React, { useEffect, useState } from 'react';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { Validation } from '@utils/validation';
import { checkPhishing } from '@utils/security';
import WebApp from '@twa-dev/sdk';
import { handleTransactionError } from '@/utils/errors';

interface WalletAccount {
  address: string;
  chain: string;
  ton: string;
  // diğer özellikler...
}

const PaymentForm = () => {
  const [tonConnectUI] = useTonConnectUI();
  const [amount, setAmount] = useState<string>('0');
  const [orderId, setOrderId] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<{
    address: string;
    amount: string;
    comment: string;
  }>({
    address: '',
    amount: '',
    comment: ''
  });

  useEffect(() => {
    // URL'den parametreleri al
    const params = new URLSearchParams(window.location.search);
    const urlAmount = params.get('amount');
    const urlOrderId = params.get('orderId');
    const urlUserId = params.get('userId');

    // Parametreleri state'e kaydet
    if (urlAmount) setAmount(urlAmount);
    if (urlOrderId) setOrderId(urlOrderId);
    if (urlUserId) setUserId(urlUserId);
  }, []);

  useEffect(() => {
    let mounted = true;

    const checkConnection = () => {
      if (mounted) {
        const isWalletConnected = !!tonConnectUI.wallet;
        setIsConnected(isWalletConnected);
        console.log('Wallet bağlantı durumu:', isWalletConnected);
      }
    };

    checkConnection();

    const unsubscribe = tonConnectUI.onStatusChange((wallet) => {
      if (mounted) {
        setIsConnected(!!wallet);
        console.log('Wallet durumu değişti:', !!wallet);
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [tonConnectUI]);

  useEffect(() => {
    const paymentData = localStorage.getItem('paymentData');
    if (paymentData) {
      try {
        const tonUrl = new URL(paymentData);
        if (tonUrl.protocol === 'ton:') {
          const address = tonUrl.pathname.replace('/transfer/', '');
          const searchParams = new URLSearchParams(tonUrl.search);
          const amount = searchParams.get('amount') || '';
          const comment = searchParams.get('text') || '';

          setPaymentDetails({
            address,
            amount,
            comment
          });

          // Otomatik ödeme başlatma
          handlePayment();  // Argümanları kaldırdık
        }
      } catch (error) {
        console.log('URI parse hatası:', error);
      }
      localStorage.removeItem('paymentData');
    }
  }, []);

  const handlePayment = async (address: string = 'EQBvW8Z5huBkMJYdnfAEM5JqTNkuWX3diqYENkWsIL0XggGG') => {
    setIsLoading(true);
    try {
      if (!tonConnectUI.connected) {
        throw new Error('Wallet not connected');
      }

      const tx = {
        validUntil: Math.floor(Date.now() / 1000) + 300,
        messages: [{
          address: address,
          amount: amount,
          stateInit: undefined,
          payload: Buffer.from(JSON.stringify({
            orderId: orderId,
            userId: userId,
            timestamp: Date.now()
          })).toString('base64')
        }]
      };

      const result = await tonConnectUI.sendTransaction(tx);
      console.log('Transaction result:', result);
      
      alert('Ödeme başarıyla tamamlandı!');
      if (WebApp.platform) {
        WebApp.close();
      }

      return result;
    } catch (error) {
      console.error('Payment error:', error);
      const errorMessage = handleTransactionError(error);
      alert(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="payment-container">
      <h2>Ödeme Onayı</h2>
      
      <div className="payment-details">
        <div className="detail-row">
          <span>Miktar:</span>
          <span>{Number(amount) / 1e9} TON</span>
        </div>
        {orderId && (
          <div className="detail-row">
            <span>Sipariş No:</span>
            <span>{orderId}</span>
          </div>
        )}
        {paymentDetails.comment && (
          <div className="detail-row">
            <span>Açıklama:</span>
            <span>{paymentDetails.comment}</span>
          </div>
        )}
      </div>

      <button 
        onClick={() => handlePayment()} 
        className="send-button"
        disabled={isLoading || !isConnected || !amount || amount === '0'}
      >
        {isLoading ? 'İşleniyor...' : 
         !isConnected ? 'Lütfen Cüzdanı Bağlayın' : 
         'Onayla ve Öde'}
      </button>
    </div>
  );
};

export default PaymentForm;