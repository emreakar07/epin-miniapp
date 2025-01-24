import { Address, beginCell, toNano } from "@ton/core";
import { TonClient } from "@ton/ton";

export const CryptoUtils = {
  isValidTonAddress: (address: string): boolean => {
    try {
      Address.parse(address);
      return true;
    } catch {
      return false;
    }
  },

  toNanoTon: (amount: string): string => {
    try {
      return toNano(amount).toString();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Geçersiz miktar formatı: ${message}`);
    }
  },

  generateTxHash: async (txData: {
    from: string;
    to: string;
    amount: string;
  }): Promise<string> => {
    try {
      const cell = beginCell()
        .storeAddress(Address.parse(txData.from))
        .storeAddress(Address.parse(txData.to))
        .storeCoins(toNano(txData.amount))
        .endCell();
      
      return cell.hash().toString('base64');
    } catch (error) {
      const message = error instanceof Error ? error.message : "Hash oluşturma hatası";
      throw new Error(message);
    }
  },

  getBalance: async (address: string): Promise<string> => {
    try {
      const client = new TonClient({ endpoint: 'https://mainnet.tonhubapi.com' });
      const balance = await client.getBalance(Address.parse(address));
      return balance.toString();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Bakiye sorgulama hatası";
      throw new Error(message);
    }
  }
};