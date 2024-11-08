import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { getUserAddresses, addUserAddress, setDefaultAddress } from 'services/addressService';

const API_URL = 'http://localhost:8000/auth';

// Define interfaces for each part of the state
export interface AccountDetails {
  name: string;
  email: string;
  password: string;
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


// Updated BillingAddress without redundant credit card details
export interface BillingAddress {
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone_number?: string;
}

export interface PaymentDetails {
  cardNumber: string;
  cardholderName: string;
  expiryDate: { month: string; year: string };
  billingAddress: BillingAddress;
  currency: string;
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

const initialState: RegistrationState = {
  accountDetails: { name: '', email: '', password: '' },
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
    expiryDate: { month: '', year: '' },
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
};

const registrationSlice = createSlice({
  name: 'registration',
  initialState,
  reducers: {
    setSellerType(state, action: PayloadAction<'individual' | 'professional'>) {
      state.sellerType = action.payload;
    },
    saveBillingAddress(state, action: PayloadAction<BillingAddress>) {
      state.billingAddress = action.payload;
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
  },
  extraReducers: (builder) => {
    builder
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
  saveStoreInformation
} = registrationSlice.actions;

export default registrationSlice.reducer;

