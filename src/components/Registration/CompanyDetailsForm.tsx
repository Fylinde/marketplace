import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { saveCompanyDetails, selectAccountDetails } from '../../redux/slices/registrationSlice';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './CompanyDetailsForm.css';
import { RootState } from '../../redux/store';
import { CompanyDetails } from '../../redux/slices/registrationSlice';

interface CompanyDetailsFormProps {
  data: CompanyDetails;
  onUpdate: (updatedData: Partial<CompanyDetails>) => void;
  onNext: () => void;
}

// Validation schema using Yup
const validationSchema = Yup.object().shape({
  country: Yup.string().required('Country is required'),
  companyType: Yup.string().required('Company type is required'),
  companyName: Yup.string().when('companyType', {
    is: (companyType: string) => companyType !== 'Individual',
    then: (schema) => schema.required('Company name is required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  firstName: Yup.string().when('companyType', {
    is: (companyType: string) => companyType === 'Individual',
    then: (schema) => schema.required('First name is required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  lastName: Yup.string().when('companyType', {
    is: (companyType: string) => companyType === 'Individual',
    then: (schema) => schema.required('Last name is required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  middleName: Yup.string(),
  companyRegistrationNumber: Yup.string().when('companyType', {
    is: (companyType: string) => companyType !== 'Individual',
    then: (schema) => schema.required('Registration number is required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  taxId: Yup.string().when('companyType', {
    is: (companyType: string) => companyType !== 'Individual',
    then: (schema) => schema.required('Tax ID is required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  countryOfIncorporation: Yup.string().when('companyType', {
    is: (companyType: string) => companyType !== 'Individual',
    then: (schema) => schema.required('Country of incorporation is required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  businessAddress: Yup.string().when('companyType', {
    is: (companyType: string) => companyType !== 'Individual',
    then: (schema) => schema.required('Business address is required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  agreed: Yup.boolean().oneOf([true], 'You must agree to continue').required(),
});

// Initial values for the form
const initialValues = {
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
  agreed: false,
};

const countryOptions = [
  'United States', 'United Kingdom', 'Canada', 'Germany', 'France', 
  'India', 'Japan', 'Australia', 'Nigeria', 'Netherlands',
];

const companyTypeOptions = [
  'Private', 'Charity', 'State-owned', 'Listed', 'Individual'
];

const CompanyDetailsForm: React.FC<CompanyDetailsFormProps> = ({ data, onUpdate, onNext }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Retrieve saved account and company details from the Redux store
  const savedCompanyDetails = useSelector((state: RootState) => state.registration.companyDetails);
  const accountDetails = useSelector(selectAccountDetails);

  // Merge savedCompanyDetails with initialValues to ensure all required fields are present
  const formInitialValues = {
    ...initialValues,
    ...savedCompanyDetails,
    firstName: accountDetails.name.split(' ')[0] || '', 
    lastName: accountDetails.name.split(' ')[1] || '', 
  };

  // Handle form submission
  const handleSubmit = (values: typeof initialValues) => {
    const { agreed, ...companyDetails } = values;
    dispatch(saveCompanyDetails(companyDetails));
    onNext();
  };

  return (
    <div className="company-details-form-container">
      <h1>Company Details</h1>
      <Formik
        initialValues={formInitialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue }) => (
          <Form className="company-details-form">
            <div className="form-group">
              <label htmlFor="country">Business Location</label>
              <Field
                as="select"
                name="country"
                id="country"
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFieldValue('country', e.target.value)}
              >
                <option value="">Select a country</option>
                {countryOptions.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="country" component="div" className="error-message" />
            </div>

            <div className="form-group">
              <label htmlFor="companyType">Type of Company</label>
              <Field
                as="select"
                name="companyType"
                id="companyType"
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFieldValue('companyType', e.target.value)}
              >
                <option value="">Select company type</option>
                {companyTypeOptions.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="companyType" component="div" className="error-message" />
            </div>

            {values.companyType === 'Individual' ? (
              <>
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <Field type="text" name="firstName" id="firstName" placeholder="e.g., John" />
                  <ErrorMessage name="firstName" component="div" className="error-message" />
                </div>

                <div className="form-group">
                  <label htmlFor="middleName">Middle Name</label>
                  <Field type="text" name="middleName" id="middleName" placeholder="e.g., Edward (optional)" />
                  <ErrorMessage name="middleName" component="div" className="error-message" />
                </div>

                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <Field type="text" name="lastName" id="lastName" placeholder="e.g., Doe" />
                  <ErrorMessage name="lastName" component="div" className="error-message" />
                </div>
              </>
            ) : (
              <>
                <div className="form-group">
                  <label htmlFor="companyName">Company Name</label>
                  <Field type="text" name="companyName" id="companyName" placeholder="e.g., ABC Corp" />
                  <ErrorMessage name="companyName" component="div" className="error-message" />
                </div>

                <div className="form-group">
                  <label htmlFor="companyRegistrationNumber">Company Registration Number</label>
                  <Field type="text" name="companyRegistrationNumber" id="companyRegistrationNumber" placeholder="e.g., 123456" />
                  <ErrorMessage name="companyRegistrationNumber" component="div" className="error-message" />
                </div>

                <div className="form-group">
                  <label htmlFor="taxId">Tax ID</label>
                  <Field type="text" name="taxId" id="taxId" placeholder="e.g., 78910" />
                  <ErrorMessage name="taxId" component="div" className="error-message" />
                </div>

                <div className="form-group">
                  <label htmlFor="countryOfIncorporation">Country of Incorporation</label>
                  <Field type="text" name="countryOfIncorporation" id="countryOfIncorporation" placeholder="e.g., United States" />
                  <ErrorMessage name="countryOfIncorporation" component="div" className="error-message" />
                </div>

                <div className="form-group">
                  <label htmlFor="businessAddress">Business Address</label>
                  <Field type="text" name="businessAddress" id="businessAddress" placeholder="e.g., 123 Main St" />
                  <ErrorMessage name="businessAddress" component="div" className="error-message" />
                </div>
              </>
            )}

            <div className="agreement-section">
              <div className="checkbox-group">
                <Field type="checkbox" name="agreed" id="agreed" />
                <label htmlFor="agreed">
                  I confirm that my business location and type are correct and understand that this information cannot be changed later.
                </label>
              </div>
              <ErrorMessage name="agreed" component="div" className="error-message" />
            </div>

            <p className="agreement-text">
              By clicking 'Agree and Continue', you agree to Fylinde's business solutions agreement, payments user agreements, and privacy policies.
            </p>

            <button type="submit" className="submit-button">
              Agree and Continue
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CompanyDetailsForm;

