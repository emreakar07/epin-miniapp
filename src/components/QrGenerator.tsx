import React from 'react';
import QRCode from 'qrcode.react';
import { toNano } from '@ton/core';
import './styles/QrGenerator.css';
import WebApp from '@twa-dev/sdk';

interface QrGeneratorProps {
  recipientAddress: string;
  amount: string;
  paymentComment?: string;
}

const QrGenerator: React.FC<QrGeneratorProps> = ({ 
  recipientAddress,
  amount,
  paymentComment = "EPIN Payment"
}) => {
  // Değişiklik 2: useTonConnectUI kaldırıldı
  const [qrValue, setQrValue] = React.useState('');

  React.useEffect(() => {
    const generateTonLink = () => {
      try {
        const nanoAmount = toNano(amount);
        const tonDeepLink = `ton://transfer/${recipientAddress}?amount=${nanoAmount}&text=${encodeURIComponent(paymentComment)}`;
        setQrValue(tonDeepLink);
      } catch (error) {
        console.error("Geçersiz miktar formatı:", error);
        setQrValue('');
      }
    };

    if (recipientAddress && amount) {
      generateTonLink();
    }
  }, [recipientAddress, amount, paymentComment]);

  // Değişiklik 3: Tema bilgisini Telegram WebApp'ten al
  const theme = WebApp.colorScheme; // 'dark' veya 'light'
  const themeParams = WebApp.themeParams;

  return (
    <div className="qr-generator-container">
      <h3 className="qr-title">TON Ödeme QR Kodu</h3>
      
      {qrValue ? (
        <div className="qr-content">
          <div className="qr-code-wrapper">
            <QRCode
              value={qrValue}
              size={256}
              level="H"
              includeMargin
              fgColor={theme === "dark" ? themeParams.button_text_color : themeParams.text_color}
              bgColor={theme === "dark" ? themeParams.bg_color : themeParams.secondary_bg_color}
            />
          </div>
          
          {/* ... Diğer içerik aynı kalacak */}
        </div>
      ) : (
        <div className="qr-placeholder">
          <p>Lütfen geçerli bir alıcı adresi ve miktar girin</p>
        </div>
      )}
    </div>
  );
};

export default QrGenerator;