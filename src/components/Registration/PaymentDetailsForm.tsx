import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { savePaymentDetails, selectPaymentDetails } from '../../redux/slices/registrationSlice';  // Add selectPaymentDetails
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import ProgressIndicator from './ProgressIndicator';
import './PaymentDetailsForm.css';

// Define the BillingAddress type
type BillingAddress = {
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone_number?: string;  // Make phone_number optional
};

type PaymentDetails = {
  cardNumber: string;
  cardholderName: string;
  expiryDate: {
    month: string;
    year: string;
  };
  billingAddress: BillingAddress;
};

interface PaymentDetailsFormProps {
  data: PaymentDetails;
  onUpdate: (updatedData: Partial<PaymentDetails>) => void;
  onNext: () => void;  // No values passed here
}

const PaymentDetailsForm: React.FC<PaymentDetailsFormProps> = ({ onNext, onUpdate, data }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Define initial values for the form
  const initialValues: PaymentDetails = {
    cardNumber: data?.cardNumber || '',
    cardholderName: data?.cardholderName || '',
    expiryDate: {
      month: data?.expiryDate?.month || '1',
      year: data?.expiryDate?.year || new Date().getFullYear().toString(),
    },
    billingAddress: data?.billingAddress || {
      street: '',
      city: '',
      state: '',
      postal_code: '',
      country: '',
    },
  };

  // Validation schema
  const validationSchema = Yup.object().shape({
    cardNumber: Yup.string()
      .required('Card number is required')
      .matches(/^[0-9]{16}$/, 'Card number must be 16 digits'),
    cardholderName: Yup.string()
      .required('Cardholder name is required')
      .matches(/^[A-Za-z\s]+$/, 'Cardholder name must only contain letters and spaces'),
    expiryDate: Yup.object().shape({
      month: Yup.string().required('Month is required'),
      year: Yup.string().required('Year is required'),
    }),
    billingAddress: Yup.object().shape({
      street: Yup.string().required('Street is required'),
      city: Yup.string().required('City is required'),
      state: Yup.string().required('State is required'),
      postal_code: Yup.string().required('Postal code is required'),
      country: Yup.string().required('Country is required'),
    }),
  });

  const handleSubmit = (values: PaymentDetails) => {
    // Dispatch the data to save in Redux
    dispatch(savePaymentDetails(values));
    // Call onUpdate to pass the updated form data
    onUpdate(values);
    // Call onNext to navigate to the next step
    onNext();
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ setFieldValue, values }) => (
        <Form className="payment-details-form">
          <ProgressIndicator currentStep={3} />
          <h1>Payment details</h1>
          <p className="subscription-info">
            Pay a monthly fee of EUR 39 (+ taxes) for access to marketplaces in North America, Europe, and Asia Pacific.
          </p>

          <div className="form-group">
            <label htmlFor="cardNumber">Card number</label>
            <Field name="cardNumber" type="text" />
            <ErrorMessage name="cardNumber" component="div" className="error-message" />
          </div>

          <div className="form-group">
            <label htmlFor="cardholderName">Cardholder name</label>
            <Field name="cardholderName" type="text" />
            <ErrorMessage name="cardholderName" component="div" className="error-message" />
          </div>

          <div className="form-group">
            <label htmlFor="expiryDate">Expires on</label>
            <div className="expiry-date">
              <Field
                as="select"
                name="expiryDate.month"
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setFieldValue('expiryDate.month', e.target.value)
                }
              >
                {[...Array(12).keys()].map(month => (
                  <option key={month + 1} value={month + 1}>{month + 1}</option>
                ))}
              </Field>
              <Field
                as="select"
                name="expiryDate.year"
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setFieldValue('expiryDate.year', e.target.value)
                }
              >
                {[...Array(10).keys()].map(i => {
                  const year = new Date().getFullYear() + i;
                  return (
                    <option key={year} value={year}>{year}</option>
                  );
                })}
              </Field>
            </div>
            <ErrorMessage name="expiryDate.month" component="div" className="error-message" />
            <ErrorMessage name="expiryDate.year" component="div" className="error-message" />
          </div>

          {/* Billing address form */}
          <h2>Billing Address</h2>

          <div className="form-group">
            <label htmlFor="billingAddress.street">Street</label>
            <Field name="billingAddress.street" type="text" />
            <ErrorMessage name="billingAddress.street" component="div" className="error-message" />
          </div>

          <div className="form-group">
            <label htmlFor="billingAddress.city">City</label>
            <Field name="billingAddress.city" type="text" />
            <ErrorMessage name="billingAddress.city" component="div" className="error-message" />
          </div>

          <div className="form-group">
            <label htmlFor="billingAddress.state">State</label>
            <Field name="billingAddress.state" type="text" />
            <ErrorMessage name="billingAddress.state" component="div" className="error-message" />
          </div>

          <div className="form-group">
            <label htmlFor="billingAddress.postal_code">Postal Code</label>
            <Field name="billingAddress.postal_code" type="text" />
            <ErrorMessage name="billingAddress.postal_code" component="div" className="error-message" />
          </div>

          <div className="form-group">
            <label htmlFor="billingAddress.country">Country</label>
            <Field name="billingAddress.country" type="text" />
            <ErrorMessage name="billingAddress.country" component="div" className="error-message" />
          </div>

          <div className="form-navigation">
            <button
              type="button"
              onClick={() => navigate('/business/contact-details')}
              className="previous-button"
            >
              Previous
            </button>
            <button type="submit" className="next-button">Next</button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default PaymentDetailsForm;

