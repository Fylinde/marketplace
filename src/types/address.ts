export interface Address {
    fullName: string;
    email: string;
    phoneNumber: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    country: string;
    street: string;
    postalCode: string;
    firstName: string;
    lastName: string;
    id?: string;
    is_primary?: boolean;
}
  
export interface AddressData {
  phoneNumber: string;
  postalCode: string;
  street: string;
  city: string;
  state: string;
  country: string; // Required field
  fullName?: string;
  email?: string;
  addressLine1?: string;
  addressLine2?: string;
  is_primary?: boolean;
}




