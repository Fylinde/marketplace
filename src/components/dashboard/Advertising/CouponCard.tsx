import React from "react";
import "./CouponCard.css";


interface Coupon {
  id: string;
  title: string;
  discount: string;
  expiryDate: string;
}

interface CouponCardProps {
  coupon: Coupon; // Updated to use `coupon` instead of `data`
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
