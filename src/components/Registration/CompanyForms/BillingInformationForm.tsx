import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { saveBillingAddress } from '../../../redux/slices/registrationSlice';

import './BillingInformationForm.css';

interface BillingInformationFormProps {
  data: {
    street: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  onUpdate: (newData: Partial<BillingInformationFormProps['data']>) => void;
  onNext: () => void;
}

const BillingInformationForm: React.FC<BillingInformationFormProps> = ({ data, onUpdate, onNext }) => {
  const dispatch = useDispatch();

  const [billingAddress, setBillingAddress] = useState({
    street: data.street || '',
    city: data.city || '',
    state: data.state || '',
    postal_code: data.postal_code || '',
    country: data.country || '',
  });

  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    cardholderName: '',
    expiryDate: {
      month: '',
      year: '',
    },
    cvv: '',
    currency: 'USD', // Default currency, can be changed by user
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setBillingAddress({
      street: data.street || '',
      city: data.city || '',
      state: data.state || '',
      postal_code: data.postal_code || '',
      country: data.country || '',
    });
  }, [data]);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBillingAddress((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    onUpdate({ [name]: value });
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
  
    setPaymentDetails((prevData) => {
      if (name === "expiryMonth" || name === "expiryYear") {
        // Update nested `expiryDate` fields
        return {
          ...prevData,
          expiryDate: {
            ...prevData.expiryDate,
            [name === "expiryMonth" ? "month" : "year"]: value,
          },
        };
      } else {
        // Update other fields directly
        return {
          ...prevData,
          [name]: value,
        };
      }
    });
  };
  

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    dispatch(saveBillingAddress(billingAddress));

    setLoading(true);
    setError(null);

    const token = await securePaymentTokenization(paymentDetails);

    if (token) {
      onNext();
    } else {
      setError("Failed to tokenize payment. Please try again.");
    }

    setLoading(false);
  };

  const securePaymentTokenization = async (paymentData: typeof paymentDetails) => {
    try {
        const requestBody = {
            cardNumber: paymentData.cardNumber,
            cardholderName: paymentData.cardholderName,
            expiryDate: {
                month: paymentData.expiryDate.month,
                year: paymentData.expiryDate.year,
            },
            cvv: paymentData.cvv,
            currency: paymentData.currency  // Ensure currency is included here
        };

        console.log("Sending request to tokenize card:", JSON.stringify(requestBody));

        const response = await fetch('http://localhost:8013/api/tokenize-card', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
        });

        console.log("Received response status:", response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Network response was not ok:', response.statusText, " - Details:", errorText);
            setError(`Failed to connect to the payment service: ${response.statusText}`);
            return null;
        }

        const contentType = response.headers.get("content-type");
        console.log("Response Content-Type:", contentType);

        if (contentType && contentType.includes("application/json")) {
            const result = await response.json();
            console.log("Received tokenization response:", result);
            return result.token;
        } else {
            const nonJsonResponse = await response.text();
            console.error('Unexpected non-JSON response:', nonJsonResponse);
            setError('Unexpected response from the server.');
            return null;
        }
    } catch (error) {
        console.error('Error tokenizing payment:', error);
        setError('An error occurred during payment tokenization.');
        return null;
    }
};


  return (
    <form onSubmit={handleSubmit} className="billing-form">
      <h2>Billing Address</h2>

      <div className="form-group">
        <label>Street</label>
        <input
          type="text"
          name="street"
          value={billingAddress.street}
          onChange={handleAddressChange}
          placeholder="Street"
        />
      </div>

      <div className="form-group">
        <label>City</label>
        <input
          type="text"
          name="city"
          value={billingAddress.city}
          onChange={handleAddressChange}
          placeholder="City"
        />
      </div>

      <div className="form-group">
        <label>State</label>
        <input
          type="text"
          name="state"
          value={billingAddress.state}
          onChange={handleAddressChange}
          placeholder="State"
        />
      </div>

      <div className="form-group">
        <label>Postal Code</label>
        <input
          type="text"
          name="postal_code"
          value={billingAddress.postal_code}
          onChange={handleAddressChange}
          placeholder="Postal Code"
        />
      </div>

      <div className="form-group">
        <label>Country</label>
        <input
          type="text"
          name="country"
          value={billingAddress.country}
          onChange={handleAddressChange}
          placeholder="Country"
        />
      </div>

      <h2>Payment Information</h2>

      <div className="form-group">
        <label>Credit Card Number</label>
        <input
          type="text"
          name="cardNumber"
          value={paymentDetails.cardNumber}
          onChange={handlePaymentChange}
          placeholder="Enter Credit Card Number"
        />
      </div>

      <div className="form-group">
        <label>Expiry Month</label>
        <input
          type="text"
          name="expiryMonth"  // Keep as "expiryMonth" for handlePaymentChange logic
          value={paymentDetails.expiryDate.month}
          onChange={handlePaymentChange}
          placeholder="MM"
        />
      </div>

      <div className="form-group">
        <label>Expiry Year</label>
        <input
          type="text"
          name="expiryYear"  // Keep as "expiryYear" for handlePaymentChange logic
          value={paymentDetails.expiryDate.year}
          onChange={handlePaymentChange}
          placeholder="YY"
        />
      </div>


      <div className="form-group">
        <label>CVV</label>
        <input
            type="text"
            name="cvv"
            value={paymentDetails.cvv}
            onChange={handlePaymentChange}
            placeholder="CVV"
        />
    </div>


      <div className="form-group">
        <label>Card Holder's Name</label>
        <input
          type="text"
          name="cardholderName"
          value={paymentDetails.cardholderName}
          onChange={handlePaymentChange}
          placeholder="Card Holder Name"
        />
      </div>

      <div className="form-group">
        <label>Currency</label>
        <select name="currency" value={paymentDetails.currency} onChange={handlePaymentChange}>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
          <option value="JPY">JPY</option>
          <option value="AUD">AUD</option>
          <option value="CAD">CAD</option>
          {/* Add other supported currencies as needed */}
        </select>
      </div>

      {error && <p className="error-message">{error}</p>}
      {loading ? <p>Processing...</p> : <button type="submit" className="submit-btn">Next</button>}
    </form>
  );
};

export default BillingInformationForm;
