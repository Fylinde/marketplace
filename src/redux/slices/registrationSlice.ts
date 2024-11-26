import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { getUserAddresses, addUserAddress, setDefaultAddress } from 'services/addressService';
import {
  FileMetadata,
  AccountDetails,
  CompanyDetails,
  ContactDetails,
  BillingAddress,
  PaymentDetails,
  ShopDetails,
  VerificationDetails,
  SellerData,
  StoreData,
  BusinessInformation,
  CompanyInformation,
  SellerInformation,
  StoreInformation,
  SellerVerification,
  IdentityVerification,
  BusinessDocumentation,
  BankAccountVerification,
  ContactPersonVerification,


 } from '@/types/sharedTypes';
const API_URL = 'http://localhost:8000/auth';



interface DocumentDetails {
  documents: File[];
}



interface DocumentUploadType {
  file: File | null;            // The uploaded file
  fileName: string;             // Name of the file
  uploadStatus: 'idle' | 'uploading' | 'succeeded' | 'failed'; // Upload status
  uploadError: string | null;   // Any error message
}




// AcknowledgmentInterface.ts
export interface Acknowledgment {
  consentGiven: boolean;
}


export interface RegistrationState {
  accountDetails: AccountDetails;
  companyDetails: CompanyDetails;
  contactDetails: ContactDetails;
  paymentDetails: PaymentDetails;
  shopDetails: ShopDetails;
  verificationDetails: VerificationDetails;
  documentDetails: DocumentDetails;
  billingAddress: BillingAddress;
  registrationStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  userAddresses: any[];
  addressError: string | null;
  companyData?: CompanyDetails;
  sellerData?: SellerData;
  storeData?: StoreData;
  contactDetailsData?: ContactDetails;
  shopSetupData?: ShopDetails;
  verificationData?: VerificationDetails;
  sellerType: 'individual' | 'professional';
  businessInformation: BusinessInformation;
  companyInformation: CompanyInformation;
  sellerInformation: SellerInformation;
  storeInformation: StoreInformation;
  sellerVerification: SellerVerification;
  identityVerification: IdentityVerification;
  businessDocumentation: BusinessDocumentation;
  bankAccountVerification: BankAccountVerification;
  contactPersonVerification: ContactPersonVerification;
  acknowledgment: Acknowledgment;
  
  
  // Optional fields to align with previous structure, now cleaned up

}

// Thunks for user registration
export const registerUser = createAsyncThunk(
  'registration/registerUser',
  async (registrationData: RegistrationState, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/register`, registrationData);
      const billingAddress = registrationData.billingAddress;

      const addressWithPhoneNumber = {
        ...billingAddress,
        phone_number: billingAddress.phone_number || 'N/A',
      };

      const addedAddress = await addUserAddress(addressWithPhoneNumber);
      if (addedAddress?.id) {
        await setDefaultAddress(addedAddress.id);
      }
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




const initialState: RegistrationState = {
  accountDetails: { full_name: '', email: '', password: '' },
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
    expiryDate: {
      month: '',
      year: '',
    },
    cvv: '',
    billingAddress: {
      street: '',
      city: '',
      state: '',
      postal_code: '',
      country: '',
    },
    currency: 'USD',  // Default currency
  },
  shopDetails: {
    storeName: '',
    productCategories: [],
    businessAddress: '',
    shippingDetails: '',
    returnPolicy: '',
  },
  verificationDetails: {
    identityDocument: null,
    businessDocument: null,
    additionalComments: '',
    verificationMethod: '',
    phoneNumber: '',
    verificationLanguage: '',
    primaryContactFirstName: '',
    primaryContactMiddleName: '',
    primaryContactLastName: '',
  },
  documentDetails: {
    documents: [],
  },
  billingAddress: {
    street: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
    phone_number: '',
  },
  registrationStatus: 'idle',
  error: null,
  userAddresses: [],
  addressError: null,
  sellerData: {
    companyRegistrationNumber: '',
    businessAddress: '',
    phoneNumber: '',
    contactPersonFirstName: '',
    contactPersonMiddleName: '',
    contactPersonLastName: '',
    smsVerificationLanguage: '',
    verificationMethod: '',
  },
  storeData: {
    storeName: '',
    upc: '',
    manufacturerBrandOwner: '',
    trademarkOwnership: '',
  },
  contactDetailsData: undefined,
  shopSetupData: undefined,
  verificationData: undefined,
  sellerType: 'individual',

  // Optional data structures for professional seller
  businessInformation: {
    businessLocation: '',
    businessType: '',
    businessName: '',
    businessWebsite: '',
    industryType: '',
    numberOfEmployees: '',
  },
  companyInformation: {
    companyName: '',
    companyRegistrationNumber: '',
    taxId: '',
    countryOfIncorporation: '',
    businessAddress: '',
    phoneNumber: '',
    contactPersonFirstName: '',
    contactPersonMiddleName: '', // Optional
    contactPersonLastName: ''
  },
  sellerInformation: {
    companyRegistrationNumber: '',
    businessAddress: '',
    phoneNumber: '',
    contactPersonFirstName: '',
    contactPersonMiddleName: '', // Optional field
    contactPersonLastName: '',
    smsVerificationLanguage: '',
    verificationMethod: '',
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
    verificationStatus: '',
    verificationError: null,
  },
  identityVerification: {
    idType: '', // Default empty string for selection
    idNumber: '',
    expiryDate: '',
    issuingCountry: '',
    idDocument: undefined as FileMetadata | undefined, // Expecting file metadata
    selfieDocument: undefined as FileMetadata | undefined, // Expecting file metadata
  },
  
  businessDocumentation: {
    documentNumber: '',
    issuingAuthority: '',
    taxIdNumber: '',
    taxCountryOfResidence: '',
    businessRegistrationDocument: undefined as FileMetadata | undefined, // Expecting file metadata
    taxDocument: undefined as FileMetadata | undefined, // Expecting file metadata
  },
  
  bankAccountVerification: {
    accountNumber: '',
    bankName: '',
    routingCode: '',
    proofOfBankOwnership: undefined as FileMetadata | undefined, // Expecting file metadata
  },
  
  contactPersonVerification: {
    fullName: '',
    position: '',
    contactEmail: '',
    contactPhoneNumber: '',
    authorizationLetter: undefined as FileMetadata | undefined, // Expecting file metadata
    companyStampOrSeal: undefined as FileMetadata | undefined, // Expecting file metadata
  },
  
  acknowledgment: {
    consentGiven: false, // Set as a boolean
  },
};

const registrationSlice = createSlice({
  name: 'registration',
  initialState,
  reducers: {
    
    
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
    saveBillingAddress(state, action: PayloadAction<BillingAddress>) {
      state.billingAddress = action.payload;
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
    saveAccountDetails(state, action: PayloadAction<AccountDetails>) {
      state.accountDetails = action.payload;
    },
    saveCompanyDetails(state, action: PayloadAction<CompanyDetails>) {
      state.companyDetails = action.payload;
    },
    saveContactDetails(state, action: PayloadAction<ContactDetails>) {
      state.contactDetails = action.payload;
    },
    savePaymentDetails(state, action: PayloadAction<PaymentDetails>) {
      state.paymentDetails = action.payload;
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
    setSellerVerificationEmail: (state, action: PayloadAction<string>) => {
      state.sellerVerification.email = action.payload;
    },
    setSellerVerificationCode: (state, action: PayloadAction<string>) => {
      state.sellerVerification.verificationCode = action.payload;
    },
    setVerificationStatus: (state, action: PayloadAction<boolean>) => {
      state.sellerVerification.isVerified = action.payload;
    },
    setVerificationError: (state, action: PayloadAction<string | null>) => {
      state.sellerVerification.verificationError = action.payload;
    },
  },
  
  extraReducers: (builder) => {
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

  },
});

// Selectors to extract specific parts of the state
export const selectAccountDetails = (state: { registration: RegistrationState }) => state.registration.accountDetails;
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

} = registrationSlice.actions;

export default registrationSlice.reducer;

