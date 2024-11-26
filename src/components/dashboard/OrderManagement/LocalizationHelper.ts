export const getCurrentLanguage = (): string => {
    return localStorage.getItem("language") || "en-US";
  };
  
  export const getCurrentCurrency = (): string => {
    return localStorage.getItem("currency") || "USD";
  };
  
  export const setLanguage = (language: string) => {
    localStorage.setItem("language", language);
  };
  
  export const setCurrency = (currency: string) => {
    localStorage.setItem("currency", currency);
  };
  