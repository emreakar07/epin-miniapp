import { Address, toNano } from "@ton/core";

export const CryptoUtils = {
  parseAddress: (address: string) => {
    try {
      return Address.parse(address);
    } catch {
      throw new Error('Geçersiz TON adresi');
    }
  },

  toSafeNano: (amount: string): bigint => {
    if (!/^\d+(\.\d+)?$/.test(amount)) {
      throw new Error('Geçersiz miktar formatı');
    }
    return toNano(amount);
  },

  isMainnetAddress: (address: string): boolean => {
    return address.startsWith('EQ');
  }
};