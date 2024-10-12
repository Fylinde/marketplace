import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { getUserAddresses, addUserAddress, deleteUserAddress, setDefaultAddress } from '../../services/addressService';

const API_URL = 'http://localhost:8000/auth';  // Correct backend URL

// Define interfaces for each part of the state
interface CompanyDetails {
  country: string;
  companyType: string;
  companyName: string;
  firstName: string;
  middleName?: string;
  lastName: string;
}

interface ContactDetails {
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

interface PaymentDetails {
  cardNumber: string;
  cardholderName: string;
  expiryDate: { month: string; year: string };
  billingAddress: BillingAddress;
}

interface ShopDetails {
  storeName: string;
  productCategories: string[];
  businessAddress: string;
  shippingDetails: string;
  returnPolicy: string;
}

interface VerificationDetails {
  identityDocument: File | null;
  businessDocument: File | null;
  additionalComments?: string;
}

interface DocumentDetails {
  documents: File[];
}

interface BillingAddress {
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone_number?: string;  // Make phone_number optional here
}

// Define the overall state structure
// In registrationSlice.ts, update the RegistrationState interface to include companyData
export interface RegistrationState {
  companyDetails: CompanyDetails;
  contactDetails: ContactDetails;
  paymentDetails: PaymentDetails;
  shopDetails: ShopDetails;
  verificationDetails: VerificationDetails;
  documentDetails: DocumentDetails;
  billingAddress: BillingAddress;
  registrationStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  companyData?: {  // Add companyData if needed
    companyName: string;
    companyRegistrationNumber: string;
    taxId: string;
    countryOfIncorporation: string;
    businessAddress: string;
  };
}


// Async thunk for user registration
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
    } catch (err: any) {
      return rejectWithValue(err.response.data);
    }
  }
);

const initialState: RegistrationState = {
  companyDetails: {
    country: '',
    companyType: '',
    companyName: '',
    firstName: '',
    middleName: '',
    lastName: '',
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
};

// Create selectors to retrieve the state values
export const selectCompanyDetails = (state: { registration: RegistrationState }) => state.registration.companyDetails;
export const selectContactDetails = (state: { registration: RegistrationState }) => state.registration.contactDetails;
export const selectPaymentDetails = (state: { registration: RegistrationState }) => state.registration.paymentDetails;
export const selectShopDetails = (state: { registration: RegistrationState }) => state.registration.shopDetails;
export const selectVerificationDetails = (state: { registration: RegistrationState }) => state.registration.verificationDetails;
export const selectDocumentDetails = (state: { registration: RegistrationState }) => state.registration.documentDetails;
export const selectBillingAddress = (state: { registration: RegistrationState }) => state.registration.billingAddress;
export const selectRegistrationStatus = (state: { registration: RegistrationState }) => state.registration.registrationStatus;
export const selectRegistrationError = (state: { registration: RegistrationState }) => state.registration.error;

const registrationSlice = createSlice({
  name: 'registration',
  initialState,
  reducers: {
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
      // Logic for final submission can be handled here if needed
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.registrationStatus = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.registrationStatus = 'succeeded';
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registrationStatus = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const {
  saveCompanyDetails,
  saveContactDetails,
  savePaymentDetails,
  saveShopDetails,
  saveVerificationDetails,
  saveDocumentDetails,
  submitRegistration,
} = registrationSlice.actions;

export default registrationSlice.reducer;
