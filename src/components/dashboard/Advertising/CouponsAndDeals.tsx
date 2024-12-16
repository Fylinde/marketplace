import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import {
  fetchCoupons,
  createCoupon,
  deleteCoupon,
  selectCoupons,
} from "../../../redux/slices/dashboard/enhancementsSlice";
import { fetchPerformance } from "../../../redux/slices/analytics/performanceSlice";
import Spinner from "components/Spinner";
import { CouponCard } from "./CouponCard";
import { CouponForm } from "./CouponForm";
import "./CouponsAndDeals.css"; // Ensure custom styling
import type { AppDispatch } from "../../../redux/store";

export const useAppDispatch = () => useDispatch<AppDispatch>();

// Adjusted interface to accept props from parent component
interface CouponsAndDealsProps {
  coupons: Coupon[];
  performance: {
    couponsUsed: number;
    couponRevenue: number;
  };
  onDeleteCoupon: (couponId: string) => void;
}

interface Coupon {
  id: string;
  title: string;
  discount: string;
  expiryDate: string;
}

const CouponsAndDeals: React.FC<CouponsAndDealsProps> = ({
  coupons,
  performance,
  onDeleteCoupon,
}) => {
  const [isFormVisible, setFormVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreateCoupon = (newCoupon: Coupon) => {
    // Placeholder logic; should ideally call a parent or Redux action
    console.log("New Coupon Created", newCoupon);
    setFormVisible(false);
  };

  if (loading) return <Spinner />;

  return (
    <div className="coupons-and-deals">
      <div className="header">
        <h1>Coupons & Deals Management</h1>
        <button
          onClick={() => setFormVisible(!isFormVisible)}
          className="create-button"
        >
          {isFormVisible ? "Cancel" : "Create New Coupon"}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {isFormVisible && (
        <CouponForm
          onSubmit={handleCreateCoupon}
          onCancel={() => setFormVisible(false)}
        />
      )}

      <div className="coupons-container">
        {coupons.map((coupon: Coupon) => (
          <CouponCard
            key={coupon.id}
            coupon={coupon}
            onDelete={() => onDeleteCoupon(coupon.id)}
          />
        ))}
      </div>

      <div className="performance-metrics">
        <h2>Performance Insights</h2>
        <p>Total Coupons Used: {performance.couponsUsed}</p>
        <p>Revenue From Coupons: ${performance.couponRevenue}</p>
      </div>
    </div>
  );
};

export default CouponsAndDeals;
