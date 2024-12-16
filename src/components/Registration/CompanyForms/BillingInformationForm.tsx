import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { saveBillingAddress } from "../../../redux/slices/auth/registrationSlice";
import { BillingAddress, PaymentDetails } from "../../../types/sharedTypes";
import "./BillingInformationForm.css";

interface BillingInformationFormProps {
  data: Partial<BillingAddress>;
  onUpdate: (newData: Partial<BillingAddress>) => void;
  onNext: () => void;
}

const BillingInformationForm: React.FC<BillingInformationFormProps> = ({
  data,
  onUpdate,
  onNext,
}) => {
  const dispatch = useDispatch();

  const [billingAddress, setBillingAddress] = useState<BillingAddress>({
    street: data.street || "",
    city: data.city || "",
    state: data.state || "",
    postal_code: data.postal_code || "",
    country: data.country || "",
    phone_number: data.phone_number || "",
    fullName: data.fullName || "",
    email: data.email || "",
    addressLine1: data.addressLine1 || "",
    addressLine2: data.addressLine2 || "",
    phone: data.phone || "",
    zipCode: data.zipCode || "",
    postalCode: data.postalCode || "",
    firstName: data.firstName || "",
    lastName: data.lastName || "",
  });

  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    cardNumber: "",
    cardholderName: "",
    expiryDate: {
      month: "",
      year: "",
    },
    cvv: "",
    billingAddress: billingAddress,
    currency: "USD", // Default currency
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setBillingAddress((prev) => ({
      ...prev,
      street: data.street || "",
      city: data.city || "",
      state: data.state || "",
      postal_code: data.postal_code || "",
      country: data.country || "",
      phone_number: data.phone_number || "",
      fullName: data.fullName || "",
      email: data.email || "",
      addressLine1: data.addressLine1 || "",
      addressLine2: data.addressLine2 || "",
      phone: data.phone || "",
      zipCode: data.zipCode || "",
      postalCode: data.postalCode || "",
      firstName: data.firstName || "",
      lastName: data.lastName || "",
    }));
  }, [data]);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBillingAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
    onUpdate({ [name]: value });
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setPaymentDetails((prevData) => {
      if (name === "expiryMonth" || name === "expiryYear") {
        return {
          ...prevData,
          expiryDate: {
            ...prevData.expiryDate,
            [name === "expiryMonth" ? "month" : "year"]: value,
          },
        };
      } else {
        return {
          ...prevData,
          [name]: value,
        };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Dispatch the validated billing address
    dispatch(saveBillingAddress(billingAddress));

    setLoading(true);
    setError(null);

    const token = await securePaymentTokenization();

    if (token) {
      onNext();
    } else {
      setError("Failed to tokenize payment. Please try again.");
    }

    setLoading(false);
  };

  const securePaymentTokenization = async () => {
    try {
      const response = await fetch("http://localhost:8013/api/tokenize-card", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentDetails),
      });

      if (!response.ok) {
        throw new Error("Failed to connect to the payment service.");
      }

      const result = await response.json();
      return result.token;
    } catch (error) {
      console.error("Error tokenizing payment:", error);
      setError("An error occurred during payment tokenization.");
      return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="billing-form">
      <h2>Billing Address</h2>

      <div className="form-group">
        <label>Full Name</label>
        <input
          type="text"
          name="fullName"
          value={billingAddress.fullName}
          onChange={handleAddressChange}
          placeholder="Full Name"
        />
      </div>

      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={billingAddress.email}
          onChange={handleAddressChange}
          placeholder="Email"
        />
      </div>

      <div className="form-group">
        <label>Phone</label>
        <input
          type="tel"
          name="phone"
          value={billingAddress.phone}
          onChange={handleAddressChange}
          placeholder="Phone"
        />
      </div>

      <div className="form-group">
        <label>Address Line 1</label>
        <input
          type="text"
          name="addressLine1"
          value={billingAddress.addressLine1}
          onChange={handleAddressChange}
          placeholder="Address Line 1"
        />
      </div>

      <div className="form-group">
        <label>Address Line 2</label>
        <input
          type="text"
          name="addressLine2"
          value={billingAddress.addressLine2}
          onChange={handleAddressChange}
          placeholder="Address Line 2 (Optional)"
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
          name="postalCode"
          value={billingAddress.postalCode}
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

      {error && <p className="error-message">{error}</p>}
      {loading ? (
        <p>Processing...</p>
      ) : (
        <button type="submit" className="submit-btn">
          Next
        </button>
      )}
    </form>
  );
};

export default BillingInformationForm;
