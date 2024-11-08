import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { saveContactDetails, selectCompanyDetails, selectAccountDetails } from '../../redux/slices/registrationSlice';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './ContactDetailsForm.css';
import ProgressIndicator from './ProgressIndicator';
import DateInput from 'services/DataInput';
import { RootState } from '../../redux/store';

type ContactDetails = {
  firstName: string;
  middleName?: string;
  lastName: string;
  countryOfCitizenship: string;
  countryOfResidence: string;
  residentialAddress: string;
  postalCode: string;
  building: string;
  state: string;
  phoneNumber: string;
  dateOfBirth: {
    day: string;
    month: string;
    year: string;
  };
  additionalAddressInfo?: {
    secondaryAddress: string;
    secondaryPostalCode: string;
    secondaryBuilding: string;
    secondaryState: string;
  };
  passportInfo?: {
    passportNumber: string;
    countryOfIssue: string;
    expiryDate: {
      day: string;
      month: string;
      year: string;
    };
  };
};

// Define the props interface
interface ContactDetailsFormProps {
  data: ContactDetails;
  onUpdate: (updatedData: Partial<ContactDetails>) => void;
  onNext: () => void;
}

const ContactDetailsForm: React.FC<ContactDetailsFormProps> = ({ data, onUpdate, onNext }) => {
  const dispatch = useDispatch();

  // Retrieve saved data from Redux store
  const savedContactDetails = useSelector((state: RootState) => state.registration.contactDetails);
  const accountDetails = useSelector(selectAccountDetails);
  const companyDetails = useSelector(selectCompanyDetails);

   // Initial values, merging Redux state and new form fields
   const initialValues: ContactDetails = {
    ...savedContactDetails,
    firstName: accountDetails.name.split(' ')[0] || companyDetails.firstName || '',
    lastName: accountDetails.name.split(' ')[1] || companyDetails.lastName || '',
    countryOfCitizenship: '',
    countryOfResidence: '',
    residentialAddress: '',
    postalCode: '',
    building: '',
    state: '',
    phoneNumber: '',
    dateOfBirth: { day: '', month: '', year: '' },
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
  };

  // Yup validation schema
  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required('First name is required'),
    middleName: Yup.string(),
    lastName: Yup.string().required('Last name is required'),
    countryOfCitizenship: Yup.string().required('Country of citizenship is required'),
    countryOfResidence: Yup.string().required('Country of residence is required'),
    residentialAddress: Yup.string().required('Residential address is required'),
    postalCode: Yup.string()
      .required('Postal code is required')
      .matches(/^[A-Za-z0-9\s\-]{4,10}$/, 'Postal code is not valid'),
    phoneNumber: Yup.string()
      .required('Phone number is required')
      .matches(/^[0-9]{10,15}$/, 'Phone number is not valid'),
    dateOfBirth: Yup.object().shape({
      day: Yup.string().required('Day is required'),
      month: Yup.string().required('Month is required'),
      year: Yup.string().required('Year is required'),
    }),
    additionalAddressInfo: Yup.object().shape({
      secondaryAddress: Yup.string(),
      secondaryPostalCode: Yup.string(),
      secondaryBuilding: Yup.string(),
      secondaryState: Yup.string(),
    }),
    passportInfo: Yup.object().shape({
      passportNumber: Yup.string(),
      countryOfIssue: Yup.string(),
      expiryDate: Yup.object().shape({
        day: Yup.string().required('Day is required'),
        month: Yup.string().required('Month is required'),
        year: Yup.string().required('Year is required'),
      }),
    }),
  });

  const handleSubmit = (values: ContactDetails) => {
    // Save form data to Redux
    dispatch(saveContactDetails(values));
  
    // Move to the next step
    onNext();
  };
  

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, setFieldValue }) => (
        <Form className="contact-details-form">
          <ProgressIndicator currentStep={2} />
          <h1>Main contact person details</h1>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First name</label>
              <Field type="text" name="firstName" id="firstName" placeholder="e.g., John" />
              <ErrorMessage name="firstName" component="div" className="error-message" />
            </div>
            <div className="form-group">
              <label htmlFor="middleName">Middle names</label>
              <Field type="text" name="middleName" id="middleName" placeholder="e.g., Edward (optional)" />
              <ErrorMessage name="middleName" component="div" className="error-message" />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last name</label>
              <Field type="text" name="lastName" id="lastName" placeholder="e.g., Doe" />
              <ErrorMessage name="lastName" component="div" className="error-message" />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="countryOfCitizenship">Country of citizenship</label>
            <Field as="select" name="countryOfCitizenship" id="countryOfCitizenship">
              <option value="">Select country</option>
              <option value="United States">United States</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Nigeria">Nigeria</option>
              <option value="India">India</option>
              <option value="Netherlands">Netherlands</option>
            </Field>
            <ErrorMessage name="countryOfCitizenship" component="div" className="error-message" />
          </div>

          <div className="form-group">
            <label htmlFor="countryOfResidence">Country of residence</label>
            <Field
              as="select"
              name="countryOfResidence"
              id="countryOfResidence"
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                const selectedCountry = e.target.value;
                setFieldValue('countryOfResidence', selectedCountry);
                setFieldValue(
                  'additionalAddressInfo',
                  selectedCountry !== values.countryOfCitizenship ? {} : undefined
                );
                setFieldValue(
                  'passportInfo',
                  selectedCountry !== values.countryOfCitizenship ? {} : undefined
                );
              }}
            >
              <option value="">Select country</option>
              <option value="United States">United States</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Nigeria">Nigeria</option>
              <option value="India">India</option>
              <option value="Netherlands">Netherlands</option>
            </Field>
            <ErrorMessage name="countryOfResidence" component="div" className="error-message" />
          </div>

          <DateInput name="dateOfBirth" label="Date of Birth" />

          <div className="form-group">
            <label htmlFor="residentialAddress">Residential address</label>
            <Field type="text" name="residentialAddress" id="residentialAddress" placeholder="e.g., 123 Main St" />
            <ErrorMessage name="residentialAddress" component="div" className="error-message" />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="postalCode">Postal code</label>
              <Field type="text" name="postalCode" id="postalCode" placeholder="e.g., 12345" />
              <ErrorMessage name="postalCode" component="div" className="error-message" />
            </div>
            <div className="form-group">
              <label htmlFor="building">Apartment/building/suite/other</label>
              <Field type="text" name="building" id="building" placeholder="e.g., Apartment 5B" />
              <ErrorMessage name="building" component="div" className="error-message" />
            </div>
            <div className="form-group">
              <label htmlFor="state">State/Region</label>
              <Field type="text" name="state" id="state" placeholder="e.g., California" />
              <ErrorMessage name="state" component="div" className="error-message" />
            </div>
          </div>

          {values.countryOfResidence !== values.countryOfCitizenship && (
            <>
              <h2>Additional Passport Information</h2>
              <div className="form-group">
                <label htmlFor="passportNumber">Passport Number</label>
                <Field type="text" name="passportInfo.passportNumber" id="passportNumber" placeholder="e.g., A1234567" />
                <ErrorMessage name="passportInfo.passportNumber" component="div" className="error-message" />
              </div>

              <div className="form-group">
                <label htmlFor="countryOfIssue">Country of Issue</label>
                <Field type="text" name="passportInfo.countryOfIssue" id="countryOfIssue" placeholder="e.g., United States" />
                <ErrorMessage name="passportInfo.countryOfIssue" component="div" className="error-message" />
              </div>

              <DateInput name="passportInfo.expiryDate" label="Passport Expiry Date" />
            </>
          )}

          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number for Verification</label>
            <Field type="tel" name="phoneNumber" id="phoneNumber" placeholder="e.g., +1 234 567 8901" />
            <ErrorMessage name="phoneNumber" component="div" className="error-message" />
          </div>

          <button type="submit" className="submit-button" onClick={onNext}>Next</button>
        </Form>
      )}
    </Formik>
  );
};

export default ContactDetailsForm;

