export const handleTransactionError = (error: unknown): string => {
  const defaultMsg = 'İşlem doğrulanamadı. Lütfen tekrar deneyin.';
  
  if (error instanceof Error) {
    switch (true) {
      case error.message.includes('User rejected'):
        return 'İşlem kullanıcı tarafından iptal edildi';
      case error.message.includes('insufficient balance'):
        return 'Yetersiz bakiye';
      case error.message.includes('Invalid address'):
        return 'Geçersiz alıcı adresi';
      default:
        return `${defaultMsg} (${error.message.slice(0, 30)})`;
    }
  }
  return defaultMsg;
};