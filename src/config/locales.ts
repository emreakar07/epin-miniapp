export const translations = {
    en: {
      sendButton: "Send Payment",
      balance: "Wallet Balance",
      recentTransactions: "Recent Transactions"
    },
    tr: {
      sendButton: "Ödemeyi Gönder",
      balance: "Cüzdan Bakiyesi",
      recentTransactions: "Son İşlemler"
    }
  };
  
  export type Language = keyof typeof translations;