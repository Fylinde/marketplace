import React from "react";
import "./CouponCard.css";

interface CouponCardProps {
  coupon: {
    id: string;
    title: string;
    discount: string;
    expiryDate: string;
  };
  onDelete: () => void;
}

export const CouponCard: React.FC<CouponCardProps> = ({ coupon, onDelete }) => (
  <div className="coupon-card">
    <h3>{coupon.title}</h3>
    <p>Discount: {coupon.discount}</p>
    <p>Expiry Date: {coupon.expiryDate}</p>
    <button onClick={onDelete} className="delete-button">
      Delete
    </button>
  </div>
);
