import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { saveCompanyDetails, selectCompanyDetails } from '../../redux/slices/registrationSlice';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './CompanyDetailsForm.css';
import { RootState } from '../../redux/store';  // Import RootState type

// Define validation schema using Yup
const validationSchema = Yup.object().shape({
  country: Yup.string().required('Country is required'),
  companyType: Yup.string().required('Company type is required'),
  companyName: Yup.string().when('companyType', (companyType: any, schema) => {
    return companyType === 'Individual' ? schema.notRequired() : schema.required('Company name is required');
  }),
  firstName: Yup.string().when('companyType', (companyType: any, schema) => {
    return companyType === 'Individual' ? schema.required('First name is required') : schema.notRequired();
  }),
  middleName: Yup.string(),
  lastName: Yup.string().when('companyType', (companyType: any, schema) => {
    return companyType === 'Individual' ? schema.required('Last name is required') : schema.notRequired();
  }),
  agreed: Yup.boolean().oneOf([true], 'You must agree to continue').required(),
});

// Define initial values (empty by default)
const initialValues = {
  country: '',
  companyType: '',
  companyName: '',
  firstName: '',
  middleName: '',
  lastName: '',
  agreed: false,
};

const countryOptions = [
  'United States', 'United Kingdom', 'Canada', 'Germany', 'France', 
  'India', 'Japan', 'Australia', 'Nigeria', 'Netherlands',
];

const companyTypeOptions = [
  'Private', 'Charity', 'State-owned', 'Listed', 'Individual'
];

interface CompanyDetailsFormProps {
  onNext: () => void;
}

const CompanyDetailsForm: React.FC<CompanyDetailsFormProps> = ({ onNext }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Retrieve saved data from the Redux store
  const savedCompanyDetails = useSelector((state: RootState) => state.registration.companyDetails);

  // Merge savedCompanyDetails with initialValues to ensure all required fields are present
  const formInitialValues = {
    ...initialValues,
    ...savedCompanyDetails,  // Merge saved company details if they exist
  };

  const handleSubmit = (values: typeof initialValues) => {
    // Save company details to the centralized state (Redux)
    dispatch(saveCompanyDetails(values));
  
    // Conditionally redirect based on the company type
    if (values.companyType === 'Individual') {
      navigate('/register/individual/contact-details');
    } else {
      navigate('/register/professional/business-information');
    }
  };
  
  return (
    <div className="company-details-form-container">
      <h1>Company Details</h1>
      <Formik
        initialValues={formInitialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values }) => (
          <Form className="company-details-form">
            <div className="form-group">
              <label htmlFor="country">Business Location</label>
              <Field as="select" name="country" id="country">
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
              <Field as="select" name="companyType" id="companyType">
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
              <div className="form-group">
                <label htmlFor="companyName">Company Name</label>
                <Field type="text" name="companyName" id="companyName" placeholder="e.g., ABC Corp" />
                <ErrorMessage name="companyName" component="div" className="error-message" />
              </div>
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
