import { CryptoUtils } from './cryptoUtils';

type ValidationResult = {
  isValid: boolean;
  message?: string;
};

export const Validation = {
  validateAddress: (address: string): ValidationResult => {
    if (!address) return { isValid: false, message: 'Adres boş olamaz' };
    if (!CryptoUtils.isValidTonAddress(address)) {
      return { isValid: false, message: 'Geçersiz TON adres formatı' };
    }
    return { isValid: true };
  },

  validateAmount: (amount: string): ValidationResult => {
    if (!/^[0-9]*\.?[0-9]+$/.test(amount)) {
      return { isValid: false, message: 'Geçersiz miktar formatı' };
    }
    if (Number(amount) <= 0) {
      return { isValid: false, message: 'Miktar pozitif olmalı' };
    }
    return { isValid: true };
  },

  sanitizeInput: (input: string): string => {
    return input
      .replace(/[^a-zA-Z0-9\-_.]/g, '')
      .slice(0, 48); // Max karakter sınırı
  },

  sanitizeAmount: (value: string): string => {
    const cleaned = value.replace(/[^0-9.]/g, '');
    const [integer, fraction] = cleaned.split('.');
    // Maximum 9.999999 TON
    const maxInteger = integer.slice(0, 1);
    return fraction ? `${maxInteger}.${fraction.slice(0, 6)}` : maxInteger;
  }
};