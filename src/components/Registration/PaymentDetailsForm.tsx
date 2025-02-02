import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { PaymentDetails } from "../../types/sharedTypes";
import { useDispatch } from "react-redux";
import { tokenizePaymentDetailsThunk } from "../../redux/slices/orders/paymentSlice";
import { AppDispatch } from "../../redux/store";

interface PaymentDetailsFormProps {
  paymentDetails: PaymentDetails;
  onUpdatePayment: (updatedData: Partial<PaymentDetails>) => void;
  onSubmitPaymentToken: (token: string) => void;
  onNext: () => void;
}

const PaymentDetailsForm: React.FC<PaymentDetailsFormProps> = ({
  paymentDetails,
  onUpdatePayment,
  onSubmitPaymentToken,
  onNext,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const initialValues: PaymentDetails = {
    cardNumber: paymentDetails.cardNumber || "",
    cardholderName: paymentDetails.cardholderName || "",
    expiryDate: {
      month: paymentDetails.expiryDate?.month || "1",
      year: paymentDetails.expiryDate?.year || new Date().getFullYear().toString(),
    },
    cvv: paymentDetails.cvv || "",
    currency: paymentDetails.currency || "USD",
  };

  const validationSchema = Yup.object().shape({
    cardNumber: Yup.string()
      .required("Card number is required")
      .matches(/^[0-9]{16}$/, "Card number must be exactly 16 digits and contain only numbers."),
    cardholderName: Yup.string().required("Cardholder name is required"),
    expiryDate: Yup.object().shape({
      month: Yup.string().required("Month is required"),
      year: Yup.string().required("Year is required"),
    }),
    cvv: Yup.string()
      .required("CVV is required")
      .matches(/^[0-9]{3,4}$/, "CVV must be 3 or 4 digits"),
    currency: Yup.string().required("Currency is required"),
  });

  const handleSubmit = async (values: PaymentDetails) => {
    try {
      // Dispatch the thunk and unwrap the result to extract the token
      const token = await dispatch(tokenizePaymentDetailsThunk(values)).unwrap();
      onSubmitPaymentToken(token); // Pass the token to the parent component
      onNext(); // Proceed to the next step
    } catch (error) {
      console.error("Failed to tokenize payment details:", error);
      alert("Tokenization failed. Please try again.");
    }
  };
  

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ setFieldValue }) => (
        <Form>
          <h2>Payment Details</h2>
          <p>Your card details are tokenized securely and will not be stored or shared.</p>

          <div className="form-group">
            <label htmlFor="cardNumber">Card Number</label>
            <Field
              name="cardNumber"
              type="text"
              placeholder="Enter your 16-digit card number"
            />
            <ErrorMessage name="cardNumber" component="div" />
          </div>

          <div className="form-group">
            <label htmlFor="cardholderName">Cardholder Name</label>
            <Field name="cardholderName" type="text" />
            <ErrorMessage name="cardholderName" component="div" />
          </div>

          <div className="form-group">
            <label htmlFor="expiryDate">Expires On</label>
            <div className="expiry-date-group">
              <Field
                as="select"
                name="expiryDate.month"
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setFieldValue("expiryDate.month", e.target.value)
                }
              >
                {[...Array(12).keys()].map((month) => (
                  <option key={month + 1} value={month + 1}>
                    {month + 1}
                  </option>
                ))}
              </Field>
              <Field
                as="select"
                name="expiryDate.year"
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setFieldValue("expiryDate.year", e.target.value)
                }
              >
                {[...Array(10).keys()].map((i) => {
                  const year = new Date().getFullYear() + i;
                  return (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  );
                })}
              </Field>
            </div>
            <ErrorMessage name="expiryDate.month" component="div" />
            <ErrorMessage name="expiryDate.year" component="div" />
          </div>

          <div className="form-group">
            <label htmlFor="cvv">CVV</label>
            <Field name="cvv" type="text" />
            <ErrorMessage name="cvv" component="div" />
          </div>

          <div className="form-group">
            <label htmlFor="currency">Currency</label>
            <Field as="select" name="currency">
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="JPY">JPY</option>
              <option value="AUD">AUD</option>
              <option value="CAD">CAD</option>
            </Field>
            <ErrorMessage name="currency" component="div" />
          </div>

          <button type="submit">Next</button>
        </Form>
      )}
    </Formik>
  );
};

export default PaymentDetailsForm;
