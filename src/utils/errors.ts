export const handleTransactionError = (error: unknown) => {
  if (error instanceof Error) {
    if (error.message.includes('User rejected')) {
      return 'İşlem kullanıcı tarafından iptal edildi';
    }
    if (error.message.includes('Invalid address')) {
      return 'Geçersiz adres formatı';
    }
    if (error.message.includes('Insufficient funds')) {
      return 'Yetersiz bakiye';
    }
    if (error.message.includes('Unable to verify')) {
      return 'İşlem doğrulanamadı. Lütfen tekrar deneyin';
    }
  }
  return 'Beklenmeyen bir hata oluştu';
}; 