import { ContactDetails, PaymentDetails, VerificationDetails, CompanyInformation } from "../types/sharedTypes";
import { ShopDetails } from "../types/shop";


export const createDefaultContactDetails = (): ContactDetails => ({
  residentialAddress: "",
  countryOfCitizenship: "",
  countryOfResidence: "",
  building: "",
  dateOfBirth: { day: "", month: "", year: "" },
  phoneNumber: "",
  fullName: "",
  email: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  country: "",
  street: "",
  firstName: "",
  lastName: "",
  postalCode: "", // Added this property
});


export const createDefaultPaymentDetails = (): PaymentDetails => ({
  cardNumber: "",
  cardholderName: "",
  expiryDate: { month: "", year: "" },
  cvv: "",
  currency: "USD",
});

export const createDefaultShopDetails = (): ShopDetails => ({
    storeName: "",
    productCategories: [],
    businessAddress: "",
    shippingDetails: "",
    returnPolicy: "",
    upc: "",
    manufacturerBrandOwner: "",
    trademarkOwnership: "",
});

export const createDefaultVerificationDetails = (): VerificationDetails => ({
    identityDocument: null,
    businessDocument: null,
    verificationMethod: "",
    phoneNumber: "",
    verificationLanguage: "",
    primaryContactFirstName: "",
    primaryContactMiddleName: "",
    primaryContactLastName: "",
    additionalComments: "",
  });
  

  export const createDefaultCompanyInformation = (): CompanyInformation => ({
    businessInformation: {
      businessLocation: "",
      businessType: "",
      businessName: "",
    },
    companyName: "",
    companyRegistrationNumber: "",
    taxId: "",
    countryOfIncorporation: "",
    businessAddress: "",
    phoneNumber: "",
    contactPersonFirstName: "",
    contactPersonLastName: "",
  });
  
