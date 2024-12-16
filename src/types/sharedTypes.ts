import { Address } from "./address";

// Define interfaces for each part of the state
export interface FileMetadata {
    name: string;
    size: number;
    type: string;
  }
  
  // Define interfaces for each part of the state
  export interface AccountDetails {
    full_name: string;
    email: string;
    password: string;
  }


  export interface ShippingAddress extends Address { 
    id?: string;
    country: string;
    state: string;
    city: string;
    postalCode: string;
  
  }
  
  export interface CompanyDetails {
    companyName: string;
    companyRegistrationNumber: string;
    taxId: string;
    countryOfIncorporation: string;
    businessAddress: string;
    country?: string;
    companyType?: string;
    firstName?: string;
    middleName?: string;
    lastName?: string;
  }
  
  export interface ContactDetails {
    firstName: string;
    middleName?: string;
    lastName: string;
    residentialAddress: string;
    countryOfCitizenship: string;
    countryOfResidence: string;
    postalCode: string;
    building: string;
    state: string;
    dateOfBirth: { day: string; month: string; year: string };
    phoneNumber: string;
    additionalAddressInfo?: {
      secondaryAddress: string;
      secondaryPostalCode: string;
      secondaryBuilding: string;
      secondaryState: string;
    };
    passportInfo?: {
      passportNumber: string;
      countryOfIssue: string;
      expiryDate: { day: string; month: string; year: string };
    };
  }
  

export interface BillingInformation {
    id: string; // Unique identifier for each billing entry
    creditCardNumber: string | null; // Nullable to handle optional fields
    expiryMonth: string | null; // Nullable to handle missing month
    expiryYear: string | null; // Nullable to handle missing year
    cardHolderName: string | null; // Nullable to handle missing name
    billingStreet: string | null; // Nullable to handle missing street
    billingCity: string | null; // Nullable to handle missing city
    billingState: string | null; // Nullable to handle missing state
    billingPostalCode: string | null; // Nullable to handle missing postal code
    billingCountry: string | null; // Nullable to handle missing country
  }

  
  
  // Updated BillingAddress without redundant credit card details
  export interface BillingAddress extends Address {
    id?: string;
    fullName: string;
    email: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    street: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    phone_number?: string;
  }
  

  
  export interface PaymentDetails {
    cardNumber: string;            // Credit card number as a string
    cardholderName: string;        // Cardholder's name
    expiryDate: {
      month: string;
      year: string;
    };
    cvv: string;                   // CVV as a string to handle both 3 and 4 digit codes
    billingAddress: BillingAddress; // Billing address structure
    currency: string;              // Currency as a required field
  }
  
  
  
  export interface ShopDetails {
    storeName: string;
    productCategories: string[];
    businessAddress: string;
    shippingDetails: string;
    returnPolicy: string;
  }
  
  export interface VerificationDetails {
    identityDocument: File | null;
    businessDocument: File | null;
    additionalComments?: string;
    verificationMethod?: string;
    phoneNumber?: string;
    verificationLanguage?: string;
    primaryContactFirstName?: string;
    primaryContactMiddleName?: string;
    primaryContactLastName?: string;
  }
  
  interface DocumentDetails {
    documents: File[];
  }
  
  export interface SellerData {
    companyRegistrationNumber: string;
    businessAddress: string;
    phoneNumber: string;
    contactPersonFirstName: string;
    contactPersonMiddleName?: string;
    contactPersonLastName: string;
    smsVerificationLanguage: string;
    verificationMethod: string;
  }
  
  export interface StoreData {
    storeName: string;
    upc: string;
    manufacturerBrandOwner: string;
    trademarkOwnership: string;
  }
  
  // types.ts
  
  export interface BusinessInformation {
    businessLocation: string;
    businessType: string;
    businessName: string;
    businessWebsite?: string;
    industryType?: string;
    numberOfEmployees?: string;
  }
  
  export interface CompanyInformation {
    companyName: string;
    companyRegistrationNumber: string;
    taxId: string;
    countryOfIncorporation: string;
    businessAddress: string;
    phoneNumber: string;
    contactPersonFirstName: string;
    contactPersonMiddleName?: string;
    contactPersonLastName: string;
  }
  
  
  export interface SellerInformation {
    companyRegistrationNumber: string;
    businessAddress: string;
    phoneNumber: string;
    contactPersonFirstName: string;
    contactPersonMiddleName?: string;
    contactPersonLastName: string;
    smsVerificationLanguage: string;
    verificationMethod: string;
  }
  
  export interface StoreInformation {
    storeName: string;
    upc: string;
    manufacturerBrandOwner: string;
    trademarkOwnership: string;
  }
  
  
  
  export interface SellerVerification {
    email: string;
    verificationCode: string;
    isVerified: boolean;
    verificationMethod: string;
    verificationStatus: string;
    verificationError: string | null;
  }
  
  // IdentityVerificationInterface.ts
  export interface IdentityVerification {
    idType: 'Passport' | 'Driver’s License' | 'National ID' | '';
    idNumber: string;
    expiryDate: string;
    issuingCountry: string;
    idDocument: FileMetadata | undefined;
    selfieDocument: FileMetadata | undefined;
  }
  
  
  // BusinessDocumentationInterface.ts
  export interface BusinessDocumentation {
    businessRegistrationDocument?: FileMetadata;
    documentNumber: string;
    issuingAuthority: string;
    taxIdNumber: string;
    taxDocument?: FileMetadata;
    taxCountryOfResidence: string;
  }
  
  // BankAccountVerificationInterface.ts
  export interface BankAccountVerification {
    accountNumber: string;
    bankName: string;
    routingCode: string;
    proofOfBankOwnership: FileMetadata | undefined;
  }
  
  
  // ContactPersonVerificationInterface.ts
  export interface ContactPersonVerification {
    fullName: string;
    position: string;
    contactEmail: string;
    contactPhoneNumber: string;
    authorizationLetter: FileMetadata | undefined;
    companyStampOrSeal: FileMetadata | undefined;
  }
  
  
  interface DocumentUploadType {
    file: File | null;            // The uploaded file
    fileName: string;             // Name of the file
    uploadStatus: 'idle' | 'uploading' | 'succeeded' | 'failed'; // Upload status
    uploadError: string | null;   // Any error message
  }


  export interface User {
    id: string;
    name: string;
    email: string;
    // Add other fields based on your API response
  }
  

  export interface PaymentMethod {
    id: string;
    name: string;
    type: string; // e.g., "Credit Card", "Bank Transfer", "Crypto"
    currency: string; // e.g., "USD", "EUR", "BTC"
    details: any; 
  }


  export interface Message {
    id: string;
    senderId: string;
    content: string;
    timestamp: string;
    read: boolean;
  }
  
  export interface Chat {
    id: string;
    buyerId: string;
    sellerId: string;
    messages: Message[];
  }
  
  export interface UploadResponse {
    fileUrl: string;
  }
  
  export interface ArchiveResponse {
    success: boolean;
    archivedAt: string;
  }


  export interface EscrowTransaction {
    id: string;
    orderId: string;
    buyerName: string;
    sellerName: string;
    amount: number;
    currency: string;
    buyerCurrency: string
    sellerCurrency: string
    status: "Pending" | "Released" | "Disputed";
    releaseDate: string;
    disputeReason?: string;
    resolutionStatus?: "Unresolved" | "Resolved" | null;
  }


  export interface InventoryItem {
    id: string;
    name: string;
    quantity: number;
    location: string;
  }