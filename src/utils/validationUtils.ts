export const validatePostalCode = (postalCode: string): boolean => {
    const postalCodeRegex = /^[A-Za-z0-9\s\-]+$/; // Adjust for specific formats if needed
    return postalCodeRegex.test(postalCode);
  };
  
  export const validateCountry = (country: string): boolean => {
    const validCountries = ["US", "CA", "GB", "AU", "IN"]; // Extend with more country codes
    return validCountries.includes(country);
  };
  
  export const validateString = (
    value: string,
    fieldName: string,
    minLength: number = 1
  ): boolean => {
    return value !== undefined && value.trim().length >= minLength;
  };
  
  
  export const validateCardNumber = (cardNumber: string): boolean => {
    const cardNumberRegex = /^\d{16}$/;
    return cardNumberRegex.test(cardNumber);
  };
  
  export const validateExpiryDate = (expiryDate: string): boolean => {
    const expiryDateRegex = /^(0[1-9]|1[0-2])\/\d{2}$/; // MM/YY format
    if (!expiryDateRegex.test(expiryDate)) return false;
  
    const [month, year] = expiryDate.split("/").map(Number);
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100; // Last two digits of the year
    const currentMonth = currentDate.getMonth() + 1;
  
    // Check if expiry date is in the future
    return year > currentYear || (year === currentYear && month >= currentMonth);
  };
  
  // src/utils/validationUtils.ts

/**
 * Validate and constrain discount percentage to a range of 0-100.
 * @param discount - The discount percentage to validate.
 * @returns A valid discount percentage between 0 and 100.
 */
export const validateDiscount = (discount: number): number => {
    return Math.max(0, Math.min(discount, 100));
  };
  