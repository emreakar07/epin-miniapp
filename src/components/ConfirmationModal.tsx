import React from 'react';

interface ModalProps {
  amount: string;
  recipient: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<ModalProps> = ({ 
  amount, 
  recipient,
  onConfirm,
  onCancel
}) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Ödemeyi Onayla</h3>
        <p>Miktar: {amount} TON</p>
        <p>Alıcı: {recipient.slice(0, 6)}...{recipient.slice(-4)}</p>
        
        <div className="modal-actions">
          <button onClick={onCancel} className="cancel-btn">İptal</button>
          <button onClick={onConfirm} className="confirm-btn">Onayla</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;