export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>; // Key-value pairs of field name and error message
}

/**
 * Validate bank details
 * @param data - Bank details object to validate
 * @returns ValidationResult
 */
export const validateBankDetails = (data: {
  bankName: string;
  accountNumber: string;
  branchName: string;
  ifscCode: string;
  accountHolder: string;
}): ValidationResult => {
  const errors: Record<string, string> = {};

  // Validate Bank Name
  if (!data.bankName || data.bankName.trim().length === 0) {
    errors.bankName = "Bank name is required.";
  } else if (data.bankName.trim().length < 3) {
    errors.bankName = "Bank name must be at least 3 characters.";
  }

  // Validate Account Number
  if (!data.accountNumber || data.accountNumber.trim().length === 0) {
    errors.accountNumber = "Account number is required.";
  } else if (!/^\d+$/.test(data.accountNumber)) {
    errors.accountNumber = "Account number must be numeric.";
  } else if (data.accountNumber.length < 10 || data.accountNumber.length > 20) {
    errors.accountNumber = "Account number must be between 10 and 20 digits.";
  }

  // Validate Branch Name
  if (!data.branchName || data.branchName.trim().length === 0) {
    errors.branchName = "Branch name is required.";
  }

  // Validate IFSC Code
  if (!data.ifscCode || data.ifscCode.trim().length === 0) {
    errors.ifscCode = "IFSC code is required.";
  } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(data.ifscCode)) {
    errors.ifscCode = "Invalid IFSC code format.";
  }

  // Validate Account Holder Name
  if (!data.accountHolder || data.accountHolder.trim().length === 0) {
    errors.accountHolder = "Account holder name is required.";
  } else if (data.accountHolder.trim().length < 3) {
    errors.accountHolder = "Account holder name must be at least 3 characters.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate general strings
 * @param value - String to validate
 * @param fieldName - Name of the field
 * @param minLength - Minimum length for validation
 * @returns Error message or empty string if valid
 */
export const validateString = (
  value: string,
  fieldName: string,
  minLength: number = 1,
  maxLength: number = Infinity
): string => {
  if (!value || value.trim().length === 0) {
    return `${fieldName} is required.`;
  } else if (value.trim().length < minLength) {
    return `${fieldName} must be at least ${minLength} characters.`;
  } else if (value.trim().length > maxLength) {
    return `${fieldName} must be no more than ${maxLength} characters.`;
  }
  return "";
};


/**
 * Validate numeric input
 * @param value - String value to validate
 * @param fieldName - Name of the field
 * @param minLength - Minimum length
 * @param maxLength - Maximum length
 * @returns Error message or empty string if valid
 */
export const validateNumeric = (
  value: string,
  fieldName: string,
  minLength: number = 1,
  maxLength: number = Infinity
): string => {
  if (!value || value.trim().length === 0) {
    return `${fieldName} is required.`;
  } else if (!/^\d+$/.test(value)) {
    return `${fieldName} must be numeric.`;
  } else if (value.length < minLength) {
    return `${fieldName} must be at least ${minLength} digits.`;
  } else if (value.length > maxLength) {
    return `${fieldName} must be no more than ${maxLength} digits.`;
  }
  return "";
};

/**
 * Validate email addresses
 * @param email - Email to validate
 * @returns Error message or empty string if valid
 */
export const validateEmail = (email: string): string => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || email.trim().length === 0) {
    return "Email is required.";
  } else if (!emailRegex.test(email)) {
    return "Invalid email format.";
  }
  return "";
};

/**
 * Validate multiple fields dynamically
 * @param fields - Object containing field values and validation rules
 * @returns ValidationResult
 */
export const validateFields = (fields: Record<string, { value: string; validate: (value: string) => string }>): ValidationResult => {
  const errors: Record<string, string> = {};
  for (const fieldName in fields) {
    const { value, validate } = fields[fieldName];
    const error = validate(value);
    if (error) {
      errors[fieldName] = error;
    }
  }
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
