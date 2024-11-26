import React, { useState } from "react";
import "./CouponForm.css";

interface CouponFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const CouponForm: React.FC<CouponFormProps> = ({
  onSubmit,
  onCancel,
}) => {
  const [title, setTitle] = useState("");
  const [discount, setDiscount] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, discount, expiryDate });
  };

  return (
    <form onSubmit={handleSubmit} className="coupon-form">
      <h3>Create New Coupon</h3>
      <label>
        Title:
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </label>
      <label>
        Discount:
        <input
          type="text"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
          required
        />
      </label>
      <label>
        Expiry Date:
        <input
          type="date"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
          required
        />
      </label>
      <button type="submit" className="submit-button">
        Create
      </button>
      <button type="button" onClick={onCancel} className="cancel-button">
        Cancel
      </button>
    </form>
  );
};
