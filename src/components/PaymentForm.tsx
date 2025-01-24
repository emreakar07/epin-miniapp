import React, { useEffect, useState } from 'react';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { Validation } from '@utils/validation';
import { checkPhishing } from '@utils/security';
import WebApp from '@twa-dev/sdk';

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
    // localStorage'dan payment verilerini al
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

          // Otomatik olarak ödeme işlemini başlat
          handlePayment(address, amount, comment);
        }
      } catch (error) {
        console.log('URI parse hatası:', error);
      }
      // Verileri temizle
      localStorage.removeItem('paymentData');
    }
  }, []);

  const handlePayment = async (address: string, amount: string, comment: string) => {
    if (!isConnected) {
      alert('Lütfen önce cüzdanınızı bağlayın');
      return;
    }

    setIsLoading(true);
    try {
      console.log('Ödeme başlatılıyor...', { address, amount, comment });

      const addressValidation = Validation.validateAddress(address);
      if (!addressValidation.isValid) {
        alert('Geçersiz adres');
        return;
      }

      if (await checkPhishing(address)) {
        alert('Şüpheli adres tespit edildi');
        return;
      }

      console.log('Transaction gönderiliyor...');
      const result = await tonConnectUI.sendTransaction({
        validUntil: Date.now() + 300000,
        messages: [
          {
            address: address,
            amount: amount,
            stateInit: undefined,
            payload: comment
          }
        ]
      });

      console.log('İşlem başarılı:', result);
      alert('Ödeme başarıyla tamamlandı!');
      
      if (WebApp.platform) {
        WebApp.close();
      }

    } catch (error) {
      console.error('İşlem hatası:', error);
      alert('İşlem sırasında bir hata oluştu. Lütfen tekrar deneyin.');
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
        onClick={() => handlePayment(
          paymentDetails.address,
          paymentDetails.amount,
          paymentDetails.comment
        )} 
        className="send-button"
        disabled={isLoading || !isConnected || !paymentDetails.address}
      >
        {isLoading ? 'İşleniyor...' : 
         !isConnected ? 'Lütfen Cüzdanı Bağlayın' : 
         'Onayla ve Öde'}
      </button>
    </div>
  );
};

export default PaymentForm;