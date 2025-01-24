import { Address, toNano } from "@ton/core";

export const TonUtils = {
  validateAddress: (address: string): boolean => {
    try {
      Address.parse(address);
      return address.startsWith('EQ') && address.length === 48;
    } catch {
      return false;
    }
  },

  sanitizeAmount: (value: string): string => {
    return value.replace(/[^0-9.]/g, '').slice(0, 10);
  }
};