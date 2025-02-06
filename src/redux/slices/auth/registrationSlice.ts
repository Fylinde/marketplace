import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosError } from "axios";
import { RootState } from '../../../redux/store';
import { getUserAddresses, addUserAddress, setDefaultAddress } from '../../../services/addressService';
import {
  FileMetadata,
  AccountDetails,
  CompanyDetails,
  ContactDetails,
  BillingAddress,
  PaymentDetails,
  VerificationDetails,
  SellerData,
  BusinessInformation,
  CompanyInformation,
  SellerInformation,
  SellerVerification,
  IdentityVerification,
  BusinessDocumentation,
  BankAccountVerification,
  ContactPersonVerification,


} from '../../../types/sharedTypes';
import { StoreInformation, StoreData, ShopDetails } from '../../../types/shop';
import { ThunkAction } from '@reduxjs/toolkit';
import { AnyAction } from 'redux';
import { AddressData } from '../../../types/address';
import { registerSeller, verifySellerCode } from "../../../services/registrationService";


export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  AnyAction
>;

const API_URL = 'http://localhost:8000/auth';



interface DocumentDetails {
  documents: File[];
}

export type ValidationResponse = {
  valid: boolean;
};



interface DocumentUploadType {
  file: File | null;            // The uploaded file
  fileName: string;             // Name of the file
  uploadStatus: 'idle' | 'uploading' | 'succeeded' | 'failed'; // Upload status
  uploadError: string | null;   // Any error message
}

interface RegisterSellerParams {
  full_name: string;
  email: string;
  password: string;
  seller_type: string;
}



// AcknowledgmentInterface.ts
export interface Acknowledgment {
  consentGiven: boolean;
}


export interface RegistrationState {
  isVerified: boolean;
  seller: object | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  sellerId: string | null; // Add sellerId
  email: string | null;
  verificationCode: string, // Ensure this is updated from the backend response
  verificationError: null,
  currentStep: string;
  emailLinkExpiration: number | null; // Timestamp in milliseconds
  lastActivityTimestamp: number | null;
  // Account and Personal Details
  accountDetails: AccountDetails;
  contactDetails: ContactDetails;
  paymentDetails: Partial<PaymentDetails>;

  // Company and Seller Details
  companyDetails: CompanyDetails;
  companyInformation: CompanyInformation;
  businessInformation: BusinessInformation;
  sellerInformation: SellerInformation;

  // Store Details
  shopDetails: ShopDetails;
  storeDetails: StoreInformation;
  storeInformation: StoreInformation;

  // Verification Details
  sellerVerification: SellerVerification;
  identityVerification: IdentityVerification;
  businessDocumentation: BusinessDocumentation;
  bankAccountVerification: BankAccountVerification;
  contactPersonVerification: ContactPersonVerification;
  verificationDetails?: VerificationDetails; // Assuming a similar structure to `verificationData`

  // Billing and Addresses
  billingAddress: Partial<BillingAddress>;
  userAddresses: any[];
  addressError: string | null;

  // Registration Flow Control
  registrationStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  sellerType: 'individual' | 'professional';

  // Optional Data for Compatibility
  documentDetails: DocumentDetails;
  ValidationResponse: ValidationResponse;
  shopSetupData?: ShopDetails;
  verificationData?: VerificationDetails;
  contactDetailsData?: ContactDetails;
  companyData?: CompanyDetails;
  sellerData?: SellerData;
  storeData?: StoreData;
  

  // Duplicated or Aligned Data (optional, clean as needed)
  billingInfo: BillingAddress;
  identityVerificationData: IdentityVerification;
  businessDocumentationData: BusinessDocumentation;
  bankAccountVerificationData: BankAccountVerification;
  contactPersonVerificationData: ContactPersonVerification;
  acknowledgment: Acknowledgment;
  acknowledgmentData: Acknowledgment;
}

// Initial State
const initialState: RegistrationState = {
  isVerified: false,
  seller: null,
  status: 'idle',
  sellerId: null, // Initialize sellerId as null
  email: null,
  verificationCode: "", // Ensure this is updated from the backend response
  verificationError: null,
  currentStep: "create_account",
  emailLinkExpiration: null,
  lastActivityTimestamp: null,
  verificationDetails: undefined,

  // Account and Personal Details
  accountDetails: {
    full_name: '',
    email: '',
    password: '',
    seller_type: 'individual',
    currency_code: "USD",
    is_email_verified: false, 
    is_phone_verified: false,
    profile_picture: null,
    preferences: null,
    verification_code: null,
    verification_expiration: null,
  },
  contactDetails: {
    firstName: '',
    middleName: '',
    lastName: '',
    residentialAddress: '',
    countryOfCitizenship: '',
    countryOfResidence: '',
    postalCode: '',
    building: '',
    state: '',
    dateOfBirth: { day: '', month: '', year: '' },
    phoneNumber: '',
    additionalAddressInfo: {
      secondaryAddress: '',
      secondaryPostalCode: '',
      secondaryBuilding: '',
      secondaryState: '',
    },
    passportInfo: {
      passportNumber: '',
      countryOfIssue: '',
      expiryDate: { day: '', month: '', year: '' },
    },
  },
  paymentDetails: {
    cardNumber: '',
    cardholderName: '',
    expiryDate: { month: '', year: '' },
    cvv: '',
    currency: 'USD',
  },

  // Company and Seller Details
  companyDetails: {
    country: '',
    companyType: '',
    companyName: '',
    firstName: '',
    middleName: '',
    lastName: '',
    companyRegistrationNumber: '',
    taxId: '',
    countryOfIncorporation: '',
    businessAddress: '',
  },
  companyInformation: {
    companyName: '',
    companyRegistrationNumber: '',
    taxId: '',
    countryOfIncorporation: '',
    businessAddress: '',
    phoneNumber: '',
    contactPersonFirstName: '',
    contactPersonMiddleName: '',
    contactPersonLastName: '',
    businessInformation: {
      businessLocation: '',
      businessType: '',
      businessName: '',
      businessWebsite: '',
      industryType: '',
      numberOfEmployees: '',
    },
  },
  businessInformation: {
    businessLocation: '',
    businessType: '',
    businessName: '',
    businessWebsite: '',
    industryType: '',
    numberOfEmployees: '',
  },
  sellerInformation: {
    companyRegistrationNumber: '',
    businessAddress: '',
    phoneNumber: '',
    contactPersonFirstName: '',
    contactPersonMiddleName: '',
    contactPersonLastName: '',
    smsVerificationLanguage: '',
    verificationMethod: '',
    
  },

  // Store Details
  shopDetails: {
    storeName: '',
    productCategories: [],
    businessAddress: '',
    shippingDetails: '',
    returnPolicy: '',
    upc: "",
    manufacturerBrandOwner: "",
    trademarkOwnership: "",
  },
  storeDetails: {
    storeName: '',
    upc: '',
    manufacturerBrandOwner: '',
    trademarkOwnership: '',
  },
  storeInformation: {
    storeName: '',
    upc: '',
    manufacturerBrandOwner: '',
    trademarkOwnership: '',
  },

  sellerVerification: {
    email: '',
    verificationCode: '',
    isVerified: false,
    verificationMethod: '',
    verificationStatus: '', // Assuming this is a string type
    verificationError: null, // Assuming null is valid for no error
    expirationTime: null, // Correctly initialized as null
    businessIndustry: "",
    yearsInOperation: 0,
    businessWebsite: "",
    altPhoneNumber: "",
},

  identityVerification: {
    idType: '',
    idNumber: '',
    expiryDate: '',
    issuingCountry: '',
    idDocument: undefined,
    selfieDocument: undefined,
  },
  businessDocumentation: {
    documentNumber: '',
    issuingAuthority: '',
    taxIdNumber: '',
    taxCountryOfResidence: '',
    businessRegistrationDocument: undefined,
    taxDocument: undefined,
  },
  bankAccountVerification: {
    accountNumber: '',
    bankName: '',
    routingCode: '',
    proofOfBankOwnership: undefined,
  },
  contactPersonVerification: {
    fullName: '',
    position: '',
    contactEmail: '',
    contactPhoneNumber: '',
    authorizationLetter: undefined,
    companyStampOrSeal: undefined,
  },

  // Billing and Addresses
  billingAddress: {
    id: '',
    firstName: '',
    lastName: '',
    fullName: '',
    email: '',
    addressLine1: '',
    addressLine2: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    phoneNumber: '',
  },
  userAddresses: [],
  addressError: null,

  // Registration Flow Control
  registrationStatus: 'idle',
  error: null,
  sellerType: 'individual',

  // Optional Data for Compatibility
  documentDetails: { documents: [] },
  ValidationResponse: {valid: false}, 
  shopSetupData: undefined,
  verificationData: undefined,
  contactDetailsData: undefined,
  companyData: undefined,
  sellerData: undefined,
  storeData: undefined,

  // Duplicated or Aligned Data
  billingInfo: {
    id: '',
    firstName: '',
    lastName: '',
    fullName: '',
    email: '',
    addressLine1: '',
    addressLine2: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    phoneNumber: '',
  },
  identityVerificationData: {
    idType: '',
    idNumber: '',
    expiryDate: '',
    issuingCountry: '',
    idDocument: undefined,
    selfieDocument: undefined,
  },
  businessDocumentationData: {
    documentNumber: '',
    issuingAuthority: '',
    taxIdNumber: '',
    taxCountryOfResidence: '',
    businessRegistrationDocument: undefined,
    taxDocument: undefined,
  },
  bankAccountVerificationData: {
    accountNumber: '',
    bankName: '',
    routingCode: '',
    proofOfBankOwnership: undefined,
  },
  contactPersonVerificationData: {
    fullName: '',
    position: '',
    contactEmail: '',
    contactPhoneNumber: '',
    authorizationLetter: undefined,
    companyStampOrSeal: undefined,
  },
  acknowledgment: { consentGiven: false },
  acknowledgmentData: { consentGiven: false },
};

const createAddressWithDefaults = (address: Partial<AddressData>): AddressData => ({
  ...address,
  phoneNumber: address.phoneNumber || "N/A", // Default for phoneNumber
  postalCode: address.postalCode || "",     // Default for postalCode
  street: address.street || "",             // Default for street
  city: address.city || "",                 // Default for city
  state: address.state || "",               // Default for state
  country: address.country || "",           // Default for country
});






// Thunks for user registration
export const registerUser = createAsyncThunk(
  "registration/registerUser",
  async (registrationData: RegistrationState, { rejectWithValue }) => {
    try {
      const billingAddress = registrationData.billingAddress;

      // Ensure all required fields in AddressData have valid values
      const addressWithPhoneNumber: AddressData = createAddressWithDefaults(
        billingAddress as Partial<AddressData>
      );

      const addedAddress = await addUserAddress(addressWithPhoneNumber);
      if (addedAddress?.id) {
        await setDefaultAddress(addedAddress.id);
      }

      const response = await axios.post(`${API_URL}/register`, registrationData);
      return response.data;
    } catch (err) {
      return rejectWithValue((err as any).response?.data);
    }
  }
);




export const fetchUserAddressList = createAsyncThunk(
  'registration/fetchUserAddressList',
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await getUserAddresses(userId);
      return response.data;
    } catch (error) {
      return rejectWithValue((error as any).response?.data || 'Failed to fetch addresses');
    }
  }
);

export const fetchIdentityVerification = createAsyncThunk(
  "registration/fetchIdentityVerification",
  async (_, { rejectWithValue }) => {
    try {
      // Replace with your API call
      const response = await fetch("/api/identity-verification");
      if (!response.ok) throw new Error("Failed to fetch identity verification data");
      return (await response.json()) as IdentityVerification;
    } catch (error) {
      return rejectWithValue("Failed to fetch identity verification data");
    }
  }
);

export const fetchBusinessDocumentation = createAsyncThunk(
  "registration/fetchBusinessDocumentation",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/business-documentation");
      if (!response.ok) throw new Error("Failed to fetch business documentation data");
      return (await response.json()) as BusinessDocumentation;
    } catch (error) {
      return rejectWithValue("Failed to fetch business documentation data");
    }
  }
);

export const fetchBankAccountVerification = createAsyncThunk(
  "registration/fetchBankAccountVerification",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/bank-account-verification");
      if (!response.ok) throw new Error("Failed to fetch bank account verification data");
      return (await response.json()) as BankAccountVerification;
    } catch (error) {
      return rejectWithValue("Failed to fetch bank account verification data");
    }
  }
);

export const fetchContactPersonVerification = createAsyncThunk(
  "registration/fetchContactPersonVerification",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/contact-person-verification");
      if (!response.ok) throw new Error("Failed to fetch contact person verification data");
      return (await response.json()) as ContactPersonVerification;
    } catch (error) {
      return rejectWithValue("Failed to fetch contact person verification data");
    }
  }
);

export const fetchAcknowledgment = createAsyncThunk(
  "registration/fetchAcknowledgment",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/acknowledgment");
      if (!response.ok) throw new Error("Failed to fetch acknowledgment data");
      return (await response.json()) as Acknowledgment;
    } catch (error) {
      return rejectWithValue("Failed to fetch acknowledgment data");
    }
  }
);

export const uploadDocument = createAsyncThunk<FileMetadata, File, { rejectValue: string }>(
  'registration/uploadDocument',
  async (document, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('file', document);

      const response = await axios.post<FileMetadata>('http://localhost:8000/api/upload-document', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            console.log(`Upload Progress: ${progress}%`);
          }
        }
      });

      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to upload document');
    }
  }
);

export const sendRegistrationEmail = createAsyncThunk(
  "registration/sendEmail",
  async (step: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const email = state.registration.sellerVerification.email;
      const stepLink = `${window.location.origin}/register/seller/${step}`;
      const now = Date.now();
      const lastActivity = state.registration.lastActivityTimestamp || 0;
      const threshold = 5 * 60 * 1000; // 5 minutes inactivity threshold

      console.log(`Preparing to send email for step: ${step}, email: ${email}`);

      // Ensure the email exists
      if (!email) {
        console.error("Email not set in Redux state. Cannot send email.");
        throw new Error("Email not found in Redux state.");
      }

      // Check inactivity threshold
      if (now - lastActivity < threshold) {
        console.log(
          `Skipped sending email. Activity threshold of ${
            threshold / 1000
          } seconds not met.`
        );
        return { skipped: true }; // Skip sending email
      }

      // Send the email
      const response = await axios.post(
        "http://localhost:8000/sellers/send-registration-email",
        { email, stepLink }
      );

      console.log(
        `Registration email sent successfully to ${email} for step: ${step}`
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response?.data || error.message);
      } else if (error instanceof Error) {
        console.error("General error:", error.message);
      } else {
        console.error("Unexpected error:", error);
      }
      return rejectWithValue("Failed to send registration email.");
    }
  }
);

// export const validateVerificationCode = createAsyncThunk(
//   "registration/validateVerificationCode",
//   async ({ code, email }: { code: string; email: string }, thunkAPI) => {
//     try {
//       const response = await axios.post("http://localhost:8000/auth/verify-code", { code, email });
//       const { isValid, message } = response.data;
//       if (isValid) {
//         return { valid: true };
//       }
//       return thunkAPI.rejectWithValue(message || "Invalid verification code");
//     } catch (error) {
//       // Check if the error is an AxiosError
//       if (axios.isAxiosError(error)) {
//         const errorMessage =
//           error.response?.data?.detail || "An unexpected error occurred during verification";
//         return thunkAPI.rejectWithValue(errorMessage);
//       }
//       // Handle non-Axios errors
//       return thunkAPI.rejectWithValue("An unexpected error occurred.");
//     }
//   }
// );

// export const registerSeller = createAsyncThunk(
//   "registration/registerSeller",
//   async (
//     {
//       full_name,
//       email,
//       password,
//       seller_type,
//     }: {
//       full_name: string;
//       email: string;
//       password: string;
//       seller_type: "individual" | "professional";
//     },
//     { rejectWithValue }
//   ) => {
//     try {
//       // Delegate backend communication to the service
//       const response = await registerSeller({
//         full_name,
//         email,
//         password,
//         seller_type,
//       });
//       return response; // Return seller data
//     } catch (error) {
//       return rejectWithValue(error);
//     }
//   }
// );


export const registerSellerThunk = createAsyncThunk(
  'registration/registerSeller',
  async ({ full_name, email, password, seller_type }: RegisterSellerParams, { rejectWithValue }) => {
      try {
          console.log("Dispatching seller registration request...");
          const response = await registerSeller({ full_name, email, password, seller_type });
          console.log("Seller registered successfully:", response);
          return response;
      } catch (error: any) {
          console.error("Seller registration failed:", error);
          return rejectWithValue(error.response?.data || "Registration failed");
      }
  }
);

/**
 * Async Thunk: Verifies the seller's verification code
 */
export const verifySellerCodeThunk = createAsyncThunk(
  "registration/verifySellerCode",
  async ({ email, code }: { email: string; code: string }, { rejectWithValue }) => {
    try {
      const isVerified: boolean = await verifySellerCode(email, code);
      return { isVerified, email }; // ✅ Correct return structure
    } catch (error: any) {
      return rejectWithValue(error.message || "Verification failed");
    }
  }
);






const registrationSlice = createSlice({
  name: 'registration',
  initialState,
  reducers: {
    resetRegistrationState: (state) => {
      state.seller = null;
      state.status = 'idle';
      state.error = null;
  },
    setSellerId(state, action: PayloadAction<string>) {
      state.sellerId = action.payload; // Set sellerId in the state
    },
    updateRegistrationData: (
      state,
      action: PayloadAction<Partial<RegistrationState['sellerVerification']>>
    ) => {
      state.sellerVerification = {
        ...state.sellerVerification,
        ...action.payload, // Merge the new data
      };
    },
    clearRegistrationData(state) {
      state.billingAddress = {};
      state.paymentDetails = {};
    },
    saveDocumentUploads: (state, action: PayloadAction<DocumentUploadType[]>) => {
      // Map DocumentUploadType[] to File[] while filtering out null values
      state.documentDetails.documents = action.payload
        .map((doc) => doc.file)
        .filter((file): file is File => !!file); // Ensure only non-null files are included
    },
       
    setCurrentStep: (state, action: PayloadAction<string>) => {
      state.currentStep = action.payload;
      state.lastActivityTimestamp = new Date().getTime(); // Update activity timestamp
    },
    
    validateLinkExpiration: (state) => {
      const now = new Date().getTime();
      if (state.emailLinkExpiration && now > state.emailLinkExpiration) {
        state.currentStep = "create_account"; // Reset step to the beginning
        state.emailLinkExpiration = new Date().getTime() + 60 * 60 * 1000; // Example: 1-hour expiration
      }
    },
    
    
    setSellerType(state, action: PayloadAction<'individual' | 'professional'>) {
      state.sellerType = action.payload;
    },
    setIdentityVerification(state, action: PayloadAction<IdentityVerification>) {
      state.identityVerification = action.payload;
    },
    setBusinessDocumentation(state, action: PayloadAction<BusinessDocumentation>) {
      state.businessDocumentation = action.payload;
    },
    setBankAccountVerification(state, action: PayloadAction<BankAccountVerification>) {
      state.bankAccountVerification = action.payload;
    },
    setContactPersonVerification(state, action: PayloadAction<ContactPersonVerification>) {
      state.contactPersonVerification = action.payload;
    },
    setAcknowledgment(state, action: PayloadAction<Acknowledgment>) {
      state.acknowledgment = action.payload;
    },
    saveBillingAddress(state, action: PayloadAction<Partial<BillingAddress>>) {
      state.billingAddress = { ...state.billingAddress, ...action.payload };
    },
    saveIdentityVerification(state, action: PayloadAction<IdentityVerification>) {
      state.identityVerification = action.payload;
    },
    updateIdentityVerification(state, action: PayloadAction<Partial<IdentityVerification>>) {
      state.identityVerification = { ...state.identityVerification, ...action.payload };
    },

    saveBusinessDocumentation(state, action: PayloadAction<BusinessDocumentation>) {
      state.businessDocumentation = action.payload;
    },
    updateBusinessDocumentation(state, action: PayloadAction<Partial<BusinessDocumentation>>) {
      state.businessDocumentation = { ...state.businessDocumentation, ...action.payload };
    },

    saveBankAccountVerification(state, action: PayloadAction<BankAccountVerification>) {
      state.bankAccountVerification = action.payload;
    },
    updateBankAccountVerification(state, action: PayloadAction<Partial<BankAccountVerification>>) {
      state.bankAccountVerification = { ...state.bankAccountVerification, ...action.payload };
    },

    saveContactPersonVerification(state, action: PayloadAction<ContactPersonVerification>) {
      state.contactPersonVerification = action.payload;
    },
    updateContactPersonVerification(state, action: PayloadAction<Partial<ContactPersonVerification>>) {
      state.contactPersonVerification = { ...state.contactPersonVerification, ...action.payload };
    },

    saveAcknowledgment(state, action: PayloadAction<Acknowledgment>) {
      state.acknowledgment = action.payload;
    },
    updateAcknowledgment(state, action: PayloadAction<Partial<Acknowledgment>>) {
      state.acknowledgment = { ...state.acknowledgment, ...action.payload };
    },
    saveBusinessInformation(state, action: PayloadAction<typeof initialState.businessInformation>) {
      state.businessInformation = action.payload;
    },
    saveCompanyInformation(state, action: PayloadAction<typeof initialState.companyInformation>) {
      state.companyInformation = action.payload;
    },
    // Action to update Business Information
    updateBusinessInformation(state, action: PayloadAction<Partial<BusinessInformation>>) {
      state.businessInformation = { ...state.businessInformation, ...action.payload };
    },
    updateCompanyInformation(state, action: PayloadAction<Partial<CompanyInformation>>) {
      state.companyInformation = { ...state.companyInformation, ...action.payload };
    },
    // Action to update both Business and Company Information
    updateCombinedInformation(
      state,
      action: PayloadAction<{ businessInformation?: Partial<BusinessInformation>; companyInformation?: Partial<CompanyInformation> }>
    ) {
      if (action.payload.businessInformation) {
        state.businessInformation = { ...state.businessInformation, ...action.payload.businessInformation };
      }
      if (action.payload.companyInformation) {
        state.companyInformation = { ...state.companyInformation, ...action.payload.companyInformation };
      }
    },
    saveSellerInformation(state, action: PayloadAction<typeof initialState.sellerInformation>) {
      state.sellerInformation = action.payload;
    },
    saveStoreInformation(state, action: PayloadAction<typeof initialState.storeInformation>) {
      state.storeInformation = action.payload;
    },
    saveAccountDetails: (state, action: PayloadAction<AccountDetails>) => {
      console.log("[Redux] Saving account details:", action.payload);
      state.accountDetails = action.payload;
  },
  
    saveCompanyDetails(state, action: PayloadAction<CompanyDetails>) {
      state.companyDetails = action.payload;
    },
    saveContactDetails(state, action: PayloadAction<ContactDetails>) {
      state.contactDetails = action.payload;
    },
    savePaymentDetails(state, action: PayloadAction<Partial<PaymentDetails>>) {
      state.paymentDetails = { ...state.paymentDetails, ...action.payload };
    },
    saveShopDetails(state, action: PayloadAction<ShopDetails>) {
      state.shopDetails = action.payload;
    },
    saveVerificationDetails(state, action: PayloadAction<VerificationDetails>) {
      state.verificationDetails = action.payload;
    },
    saveDocumentDetails(state, action: PayloadAction<DocumentDetails>) {
      state.documentDetails = action.payload;
    },
    submitRegistration(state) {
      // Logic for final submission if needed
    },
    saveSellerVerification(state, action: PayloadAction<SellerVerification>) {
      state.sellerVerification = action.payload;
    },
    setSellerVerificationEmail: (state, action) => {
      console.log("[Redux] Set Seller Verification Email:", action.payload);
  
      // Ensure sellerVerification is initialized with required properties
      if (!state.sellerVerification) {
          state.sellerVerification = {
            email: "",                // Default empty string
            verificationCode: "",
            verificationError: null,
            verificationStatus: '',// Default empty string
            isVerified: false,        // Default false
            verificationMethod: "",   // Default empty string
            expirationTime: null,     // Default null
          };
      }
  
      // Set the email in sellerVerification
      state.sellerVerification.email = action.payload;
  },
  
  
    setSellerVerificationCode: (state, action) => {
      console.log("[Redux] Set Verification Code:", action.payload);
      state.sellerVerification.verificationCode = action.payload;
    },
    setVerificationStatus: (state, action) => {
      console.log("[Redux] Set Verification Status:", action.payload);
      state.sellerVerification.isVerified = action.payload;
    },
    setVerificationError: (state, action) => {
      console.log("[Redux] Set Verification Error:", action.payload);
      state.sellerVerification.verificationError = action.payload;
    },
    setEmailLinkExpiration: (state, action) => {
      state.emailLinkExpiration = action.payload;
    },
    saveVerificationCode(state, action: PayloadAction<string>) {
      state.verificationCode = action.payload;
    },
    // updateRegistrationData(state, action: PayloadAction<Partial<RegistrationState["accountDetails"]>>) {
    //   state.accountDetails = {
    //     ...state.accountDetails,
    //     ...action.payload, // ✅ Merge new data without removing existing values
    //   };
    // },
  

  },
  
  extraReducers: (builder) => {
    builder
    .addCase(verifySellerCodeThunk.fulfilled, (state, action) => {
      state.sellerVerification.isVerified = action.payload.isVerified;
      state.sellerVerification.verificationError = null;
  
      // ✅ Ensure the email is always stored
      if (action.payload.email) {
        state.accountDetails.email = action.payload.email;
        localStorage.setItem("registeredEmail", action.payload.email); // ✅ Save as backup
      }
    })
    .addCase(verifySellerCodeThunk.rejected, (state, action) => {
      state.sellerVerification.isVerified = false;
      state.sellerVerification.verificationError = action.payload as string;
    });
  
  
  

    builder
       // Document upload cases
       .addCase(uploadDocument.fulfilled, (state, action: PayloadAction<FileMetadata>) => {
        console.log('File uploaded successfully:', action.payload);
      })
      .addCase(uploadDocument.rejected, (state, action) => {
        console.error('File upload failed:', action.payload);
      })
      .addCase(registerUser.pending, (state) => {
        state.registrationStatus = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.registrationStatus = 'succeeded';
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registrationStatus = 'failed';
        state.error = action.payload as string;
      })
      .addCase(fetchUserAddressList.pending, (state) => {
        state.registrationStatus = 'loading';
        state.addressError = null;
      })
      .addCase(fetchUserAddressList.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.registrationStatus = 'succeeded';
        state.userAddresses = action.payload;
      })
      .addCase(fetchUserAddressList.rejected, (state, action) => {
        state.registrationStatus = 'failed';
        state.addressError = action.payload as string;
      })
 
     // Fetch identity verification data cases
     .addCase(fetchIdentityVerification.pending, (state) => {
      state.registrationStatus = 'loading';
      state.error = null;
    })
    .addCase(fetchIdentityVerification.fulfilled, (state, action: PayloadAction<IdentityVerification>) => {
      state.registrationStatus = 'succeeded';
      state.identityVerification = action.payload;
    })
    .addCase(fetchIdentityVerification.rejected, (state, action) => {
      state.registrationStatus = 'failed';
      state.error = action.payload as string;
    })

    // Fetch business documentation data cases
    .addCase(fetchBusinessDocumentation.pending, (state) => {
      state.registrationStatus = 'loading';
      state.error = null;
    })
    .addCase(fetchBusinessDocumentation.fulfilled, (state, action: PayloadAction<BusinessDocumentation>) => {
      state.registrationStatus = 'succeeded';
      state.businessDocumentation = action.payload;
    })
    .addCase(fetchBusinessDocumentation.rejected, (state, action) => {
      state.registrationStatus = 'failed';
      state.error = action.payload as string;
    })

    // Fetch bank account verification data cases
    .addCase(fetchBankAccountVerification.pending, (state) => {
      state.registrationStatus = 'loading';
      state.error = null;
    })
    .addCase(fetchBankAccountVerification.fulfilled, (state, action: PayloadAction<BankAccountVerification>) => {
      state.registrationStatus = 'succeeded';
      state.bankAccountVerification = action.payload;
    })
    .addCase(fetchBankAccountVerification.rejected, (state, action) => {
      state.registrationStatus = 'failed';
      state.error = action.payload as string;
    })

    // Fetch contact person verification data cases
    .addCase(fetchContactPersonVerification.pending, (state) => {
      state.registrationStatus = 'loading';
      state.error = null;
    })
    .addCase(fetchContactPersonVerification.fulfilled, (state, action: PayloadAction<ContactPersonVerification>) => {
      state.registrationStatus = 'succeeded';
      state.contactPersonVerification = action.payload;
    })
    .addCase(fetchContactPersonVerification.rejected, (state, action) => {
      state.registrationStatus = 'failed';
      state.error = action.payload as string;
    })

    // Fetch acknowledgment data cases
    .addCase(fetchAcknowledgment.pending, (state) => {
      state.registrationStatus = 'loading';
      state.error = null;
    })
    .addCase(fetchAcknowledgment.fulfilled, (state, action: PayloadAction<Acknowledgment>) => {
      state.registrationStatus = 'succeeded';
      state.acknowledgment = action.payload;
    })
    .addCase(fetchAcknowledgment.rejected, (state, action) => {
      state.registrationStatus = 'failed';
      state.error = action.payload as string;
    });
    builder
    .addCase(sendRegistrationEmail.pending, (state) => {
      console.log("Sending registration email...");
    })
    .addCase(sendRegistrationEmail.fulfilled, (state, action) => {
      console.log("Registration email sent successfully:", action.payload);
    })
    .addCase(sendRegistrationEmail.rejected, (state, action) => {
      console.error("Failed to send registration email:", action.payload);
    });
    
    builder
    .addCase(registerSellerThunk.pending, (state) => {
        console.log("Seller registration request in progress...");
        state.status = 'loading';
    })
    .addCase(registerSellerThunk.fulfilled, (state, action: PayloadAction<object>) => {
        console.log("Seller registration successful:", action.payload);
        state.status = 'succeeded';
        state.seller = action.payload;
    })
    .addCase(registerSellerThunk.rejected, (state, action: PayloadAction<any>) => {
        console.error("Seller registration failed:", action.payload);
        state.status = 'failed';
        state.error = action.payload as string;
    });
    

  },
});

// Selectors to extract specific parts of the state
export const selectEmailLinkExpiration = (state: RootState): number | null =>
  state.registration.emailLinkExpiration;


export const selectSellerVerificationEmail = (state: RootState) => state.registration.sellerVerification.email;

export const selectAccountDetails = (state: RootState) => state.registration.accountDetails;
export const selectCompanyDetails = (state: { registration: RegistrationState }) => state.registration.companyDetails;
export const selectContactDetails = (state: { registration: RegistrationState }) => state.registration.contactDetails;
export const selectPaymentDetails = (state: { registration: RegistrationState }) => state.registration.paymentDetails;
export const selectShopDetails = (state: { registration: RegistrationState }) => state.registration.shopDetails;
export const selectVerificationDetails = (state: { registration: RegistrationState }) => state.registration.verificationDetails;
export const selectDocumentDetails = (state: { registration: RegistrationState }) => state.registration.documentDetails;
export const selectBillingAddress = (state: { registration: RegistrationState }) => state.registration.billingAddress;
export const selectRegistrationStatus = (state: { registration: RegistrationState }) => state.registration.registrationStatus;
export const selectRegistrationError = (state: { registration: RegistrationState }) => state.registration.error;
export const selectUserAddresses = (state: { registration: RegistrationState }) => state.registration.userAddresses;
export const selectAddressError = (state: { registration: RegistrationState }) => state.registration.addressError;
export const selectBusinessInformation = (state: { registration: RegistrationState }) => state.registration.businessInformation;
export const selectCompanyInformation = (state: { registration: RegistrationState }) => state.registration.companyInformation;
export const selectSellerVerification = (state: { registration: RegistrationState }) => state.registration.sellerVerification;
export const selectSellerType = (state: { registration: RegistrationState }) => state.registration.sellerType;
export const selectIdentityVerification = (state: { registration: RegistrationState }) => state.registration.identityVerification;
export const selectBusinessDocumentation = (state: { registration: RegistrationState }) => state.registration.businessDocumentation;
export const selectBankAccountVerification = (state: { registration: RegistrationState }) => state.registration.bankAccountVerification;
export const selectContactPersonVerification = (state: { registration: RegistrationState }) => state.registration.contactPersonVerification;
export const selectAcknowledgment = (state: { registration: RegistrationState }) => state.registration.acknowledgment;

export const {
  saveVerificationCode,
  updateRegistrationData,
  clearRegistrationData,
  saveAccountDetails,
  saveCompanyDetails,
  saveContactDetails,
  savePaymentDetails,
  saveShopDetails,
  saveVerificationDetails,
  saveDocumentDetails,
  submitRegistration,
  setSellerType,
  saveBillingAddress ,
  saveBusinessInformation,
  saveCompanyInformation,
  saveSellerInformation,
  setVerificationStatus,
  setVerificationError,
  setSellerVerificationEmail,
  setSellerVerificationCode,
  saveSellerVerification,
  saveStoreInformation,
  saveIdentityVerification,
  saveBankAccountVerification,
  saveContactPersonVerification,
  saveBusinessDocumentation,
  saveAcknowledgment,
  setBusinessDocumentation,
  updateBusinessDocumentation,
  setContactPersonVerification,
  updateContactPersonVerification,
  updateIdentityVerification,
  updateBankAccountVerification,
  setCurrentStep,
  validateLinkExpiration,
  saveDocumentUploads,
  setEmailLinkExpiration,
  setSellerId ,
  

} = registrationSlice.actions;

export default registrationSlice.reducer;

