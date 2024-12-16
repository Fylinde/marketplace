export interface Address {
    fullName: string;
    email: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    street: string; // Add this field
    postalCode: string; // Add this field
    firstName: string; // Add this field
    lastName: string; // Add this field
    zip?: string; // Add `zip` as an optional field
  }