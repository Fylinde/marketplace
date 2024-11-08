import React from 'react';
import { useDispatch } from 'react-redux';
import { savePaymentDetails } from '../../redux/slices/registrationSlice';
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
  phone_number?: string;
};

// Define the PaymentDetails type, including billing address and currency
type PaymentDetails = {
  cardNumber: string;
  cardholderName: string;
  expiryDate: {
    month: string;
    year: string;
  };
  billingAddress: BillingAddress;
  currency: string; // Updated to make currency dynamic
};

// Define the props interface for the component
interface PaymentDetailsFormProps {
  data: PaymentDetails;
  onUpdatePayment: (updatedData: Partial<PaymentDetails>) => void;
  onUpdateBillingAddress: (updatedData: Partial<BillingAddress>) => void;
  onSubmitPaymentToken?: (token: string) => void;
  onNext: () => void;
}

const PaymentDetailsForm: React.FC<PaymentDetailsFormProps> = ({
  data,
  onUpdatePayment,
  onUpdateBillingAddress,
  onSubmitPaymentToken,
  onNext
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const initialValues: PaymentDetails = {
    cardNumber: data.cardNumber || '',
    cardholderName: data.cardholderName || '',
    expiryDate: {
      month: data.expiryDate.month || '1',
      year: data.expiryDate.year || new Date().getFullYear().toString(),
    },
    billingAddress: {
      street: data.billingAddress.street || '',
      city: data.billingAddress.city || '',
      state: data.billingAddress.state || '',
      postal_code: data.billingAddress.postal_code || '',
      country: data.billingAddress.country || '',
    },
    currency: data.currency || 'USD',  // Default to USD if not provided
  };

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
    currency: Yup.string().required('Currency is required'),  // Add currency validation
  });

  const handleTokenization = async () => {
    try {
      const token = await getPaymentTokenFromGateway(); // Simulated tokenization call
      if (onSubmitPaymentToken) {
        onSubmitPaymentToken(token); // Only call if defined
      }
    } catch (error) {
      console.error('Tokenization error:', error);
    }
  };

  const handleSubmit = (values: PaymentDetails) => {
    dispatch(savePaymentDetails(values));
    onUpdatePayment(values);
    handleTokenization(); // Call the tokenization process
    onNext();
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ setFieldValue }) => (
        <Form className="payment-details-form">
          <ProgressIndicator currentStep={3} />
          <h1>Payment details</h1>
          <p className="subscription-info">
            Pay a monthly fee of EUR 39 (+ taxes) for access to marketplaces in North America, Europe, and Asia Pacific.
          </p>

          {/* Currency Selection */}
          <div className="form-group">
            <label htmlFor="currency">Currency</label>
            <Field
              as="select"
              name="currency"
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                const currency = e.target.value;
                setFieldValue('currency', currency);
                onUpdatePayment({ currency });
              }}
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="JPY">JPY</option>
              <option value="AUD">AUD</option>
              <option value="CAD">CAD</option>
              {/* Add more supported currencies here if needed */}
            </Field>
            <ErrorMessage name="currency" component="div" className="error-message" />
          </div>

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

          {/* Expiry Date Fields */}
          <div className="form-group">
            <label htmlFor="expiryDate">Expires on</label>
            <div className="expiry-date">
              <Field
                as="select"
                name="expiryDate.month"
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  const newMonth = e.target.value;
                  setFieldValue('expiryDate.month', newMonth);
                }}
              >
                {[...Array(12).keys()].map(month => (
                  <option key={month + 1} value={month + 1}>{month + 1}</option>
                ))}
              </Field>
              <Field
                as="select"
                name="expiryDate.year"
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  const newYear = e.target.value;
                  setFieldValue('expiryDate.year', newYear);
                }}
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

          {/* Billing Address Fields */}
          <h2>Billing Address</h2>

          {/* ... Other Billing Address Fields ... */}

          <div className="form-navigation">
            <button type="button" onClick={() => navigate('/business/contact-details')} className="previous-button">
              Previous
            </button>
            <button type="submit" className="next-button">Next</button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

// Placeholder function to represent tokenization with a payment gateway
async function getPaymentTokenFromGateway(): Promise<string> {
  // Implement actual tokenization logic with a payment provider here.
  return "secure_payment_token"; // Replace with actual token
}

export default PaymentDetailsForm;
