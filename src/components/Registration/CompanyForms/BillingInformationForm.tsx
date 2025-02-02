import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { saveBillingAddress } from "../../../redux/slices/auth/registrationSlice";
import { BillingAddress } from "../../../types/sharedTypes";
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
    fullName: data.fullName || "",
    email: data.email || "",
    phoneNumber: data.phoneNumber || "",
    addressLine1: data.addressLine1 || "",
    addressLine2: data.addressLine2 || "",
    city: data.city || "",
    state: data.state || "",
    postalCode: data.postalCode || "",
    country: data.country || "",
    street: data.street || "", // Add the 'street' field here
  });

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBillingAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
    onUpdate({ [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(saveBillingAddress(billingAddress));
    onNext();
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
        <label>Phone Number</label>
        <input
          type="tel"
          name="phoneNumber"
          value={billingAddress.phoneNumber}
          onChange={handleAddressChange}
          placeholder="Phone Number"
        />
      </div>
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
        <label>Address Line 2 (Optional)</label>
        <input
          type="text"
          name="addressLine2"
          value={billingAddress.addressLine2}
          onChange={handleAddressChange}
          placeholder="Address Line 2"
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
        <select
          name="country"
          value={billingAddress.country}
          onChange={handleAddressChange}
        >
          <option value="">Select Country</option>
          <option value="US">United States</option>
          <option value="CA">Canada</option>
          <option value="GB">United Kingdom</option>
          <option value="AU">Australia</option>
          {/* Add more countries as needed */}
        </select>
      </div>
      <button type="submit" className="next-button">
        Next
      </button>
    </form>
  );
};

export default BillingInformationForm;
