// Dynamic Translations Loader
import enChatbot from 'locales/en/chatbot.json';
import enRefundAutomation from 'locales/en/refundAutomation.json';
import enShipping from 'locales/en/shipping.json';
import enReturnAndRefund from 'locales/en/returnAndRefund.json';
import esReturnAndRefund from 'locales/es/returnAndRefund.json';
import esChatbot from 'locales/es/chatbot.json';
import esShipping from 'locales/es/shipping.json';

const translations: Record<string, Record<string, Record<string, string>>> = {
  en: {
    chatbot: enChatbot,
    refundAutomation: enRefundAutomation,
    returnAndRefund: enReturnAndRefund,
    shipping: enShipping,
  },
  es: {
    chatbot: esChatbot,
    returnAndRefund: esReturnAndRefund,
    shipping: esShipping,
  },
};

/**
 * Fetch a localized string based on the key and optional placeholders.
 * @param key The translation key in the JSON files.
 * @param module The module name (e.g., 'chatbot', 'refundAutomation').
 * @param placeholders Optional placeholders to replace in the localized string.
 * @returns The localized string or the key as a fallback.
 */
export const getLocalizedText = (
  key: string,
  module: keyof typeof translations["en"],
  placeholders?: Record<string, string>
): string => {
  const language = localStorage.getItem('language') || 'en'; // Replace with your dynamic language detection logic.

  // Safely access the module translations
  const localizedModule = translations[language]?.[module];
  if (!localizedModule) return key;

  // Fetch the localized text
  let text: string = localizedModule[key] || key;

  // Replace placeholders if provided
  if (placeholders) {
    text = Object.entries(placeholders).reduce(
      (updatedText, [placeholder, value]) =>
        updatedText.replace(`{{${placeholder}}}`, value),
      text
    );
  }

  return text;
};

/**
 * Formats a number as a currency string.
 * @param amount The numeric value to format.
 * @param currency The ISO 4217 currency code (e.g., "USD", "EUR").
 * @returns A localized currency string.
 */
export const formatCurrency = (amount: number, currency: string): string => {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
  }).format(amount);
};
