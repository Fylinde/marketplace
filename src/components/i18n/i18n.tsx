import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import JSON translations
import chatbotEn from "locales/en/chatbot.json";
import shippingEn from "locales/en/shipping.json";
import chatbotEs from "locales/es/chatbot.json";
import shippingEs from "locales/es/shipping.json";
import refundAutomationEn from "locales/en/refundAutomation.json"

// Combine translations under namespaces
const resources = {
  en: {
    chatbot: chatbotEn,  // Chatbot namespace for English
    shipping: shippingEn, // Shipping namespace for English
    refundAutomation: refundAutomationEn
  },
  es: {
    chatbot: chatbotEs,  // Chatbot namespace for Spanish
    shipping: shippingEs // Shipping namespace for Spanish
  },
};

i18n.use(initReactI18next).init({
  resources,            // The resources object
  lng: "en",            // Default language
  fallbackLng: "en",    // Fallback language
  ns: ["chatbot", "shipping"], // Namespaces
  defaultNS: "chatbot",        // Default namespace
  interpolation: {
    escapeValue: false, // React already escapes HTML
  },
});

export default i18n;
