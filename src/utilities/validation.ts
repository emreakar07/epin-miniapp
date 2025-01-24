import { toNano } from '@ton/core';
import { CryptoUtils } from './cryptoUtils';

export const Validation = {
  validateAddress: (address: string) => {
    try {
      CryptoUtils.parseAddress(address);
      return { isValid: true };
    } catch {
      return { isValid: false, error: 'EQ ile başlayan geçerli adres girin' };
    }
  },

  validateAmount: (amount: string) => {
    try {
      const nano = CryptoUtils.toSafeNano(amount);
      return nano > toNano('0.01') ? 
        { isValid: true } : 
        { isValid: false, error: 'Minimum 0.01 TON' };
    } catch {
      return { isValid: false, error: 'Geçersiz miktar' };
    }
  }
};