export const validateAddress = (address: string): boolean => {
    return /^EQ[0-9a-zA-Z]{48}$/.test(address);
  };
  
  export const sanitizeAmount = (value: string): string => {
    const cleaned = value.replace(/[^0-9.]/g, '');
    const [integer, fraction] = cleaned.split('.');
    return fraction ? `${integer}.${fraction.slice(0, 2)}` : integer;
  };
  
  export const checkPhishing = async (address: string): Promise<boolean> => {
    try {
      const response = await fetch(`https://tonapi.io/v1/account/getInfo?account=${address}`);
      const data = await response.json();
      return data?.is_scam || false;
    } catch {
      return false;
    }
  };