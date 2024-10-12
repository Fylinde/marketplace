import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { savePaymentDetails } from '../../../redux/slices/registrationSlice';
import './BillingInformationForm.css';

interface BillingInformationFormProps {
  data: {
    cardNumber: string;
    cardholderName: string;
    expiryDate: { month: string; year: string };
    billingAddress: {
      street: string;
      city: string;
      state: string;
      postal_code: string;
      country: string;
    };
  };
  onUpdate: (newData: Partial<BillingInformationFormProps['data']>) => void;
  onNext: () => void;
}

const BillingInformationForm: React.FC<BillingInformationFormProps> = ({ data, onUpdate, onNext }) => {
  const dispatch = useDispatch();

  // Initialize form state with props or fallback to defaults
  const [formData, setFormData] = useState({
    creditCardNumber: data.cardNumber || '',
    expiryMonth: data.expiryDate?.month || '',
    expiryYear: data.expiryDate?.year || '',
    cardHolderName: data.cardholderName || '',
    billingStreet: data.billingAddress?.street || '',
    billingCity: data.billingAddress?.city || '',
    billingState: data.billingAddress?.state || '',
    billingPostalCode: data.billingAddress?.postal_code || '',
    billingCountry: data.billingAddress?.country || '',
  });

  useEffect(() => {
    setFormData({
      creditCardNumber: data.cardNumber || '',
      expiryMonth: data.expiryDate?.month || '',
      expiryYear: data.expiryDate?.year || '',
      cardHolderName: data.cardholderName || '',
      billingStreet: data.billingAddress?.street || '',
      billingCity: data.billingAddress?.city || '',
      billingState: data.billingAddress?.state || '',
      billingPostalCode: data.billingAddress?.postal_code || '',
      billingCountry: data.billingAddress?.country || '',
    });
  }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Update parent component on change
    onUpdate({
      cardNumber: formData.creditCardNumber,
      cardholderName: formData.cardHolderName,
      expiryDate: {
        month: formData.expiryMonth,
        year: formData.expiryYear,
      },
      billingAddress: {
        street: formData.billingStreet,
        city: formData.billingCity,
        state: formData.billingState,
        postal_code: formData.billingPostalCode,
        country: formData.billingCountry,
      },
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Dispatch form data to Redux
    dispatch(savePaymentDetails({
      cardNumber: formData.creditCardNumber,
      cardholderName: formData.cardHolderName,
      expiryDate: {
        month: formData.expiryMonth,
        year: formData.expiryYear,
      },
      billingAddress: {
        street: formData.billingStreet,
        city: formData.billingCity,
        state: formData.billingState,
        postal_code: formData.billingPostalCode,
        country: formData.billingCountry,
      },
    }));

    // Proceed to the next step
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="billing-form">
      <h2>Billing Information</h2>

      <div className="form-group">
        <label>Credit Card Number</label>
        <input
          type="text"
          name="creditCardNumber"
          value={formData.creditCardNumber}
          onChange={handleChange}
          placeholder="Enter Credit Card Number"
        />
      </div>

      <div className="form-group">
        <label>Expiry Month</label>
        <input
          type="text"
          name="expiryMonth"
          value={formData.expiryMonth}
          onChange={handleChange}
          placeholder="MM"
        />
      </div>

      <div className="form-group">
        <label>Expiry Year</label>
        <input
          type="text"
          name="expiryYear"
          value={formData.expiryYear}
          onChange={handleChange}
          placeholder="YY"
        />
      </div>

      <div className="form-group">
        <label>Card Holder's Name</label>
        <input
          type="text"
          name="cardHolderName"
          value={formData.cardHolderName}
          onChange={handleChange}
          placeholder="Card Holder Name"
        />
      </div>

      <div className="form-group">
        <label>Billing Street</label>
        <input
          type="text"
          name="billingStreet"
          value={formData.billingStreet}
          onChange={handleChange}
          placeholder="Street"
        />
      </div>

      <div className="form-group">
        <label>Billing City</label>
        <input
          type="text"
          name="billingCity"
          value={formData.billingCity}
          onChange={handleChange}
          placeholder="City"
        />
      </div>

      <div className="form-group">
        <label>Billing State</label>
        <input
          type="text"
          name="billingState"
          value={formData.billingState}
          onChange={handleChange}
          placeholder="State"
        />
      </div>

      <div className="form-group">
        <label>Postal Code</label>
        <input
          type="text"
          name="billingPostalCode"
          value={formData.billingPostalCode}
          onChange={handleChange}
          placeholder="Postal Code"
        />
      </div>

      <div className="form-group">
        <label>Billing Country</label>
        <input
          type="text"
          name="billingCountry"
          value={formData.billingCountry}
          onChange={handleChange}
          placeholder="Country"
        />
      </div>

      <button type="submit" className="submit-btn">Next</button>
    </form>
  );
};

export default BillingInformationForm;
