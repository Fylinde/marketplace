import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import {
  fetchCoupons,
  createCoupon,
  deleteCoupon,
  selectCoupons,
} from "../../../redux/slices/enhancementsSlice";
import { fetchPerformance } from "../../../redux/slices/performanceSlice";
import Spinner from "components/Spinner";
import { CouponCard } from "./CouponCard";
import { CouponForm } from "./CouponForm";
import "./CouponsAndDeals.css"; // Ensure custom styling
import type { AppDispatch } from "../../../redux/store";


export const useAppDispatch = () => useDispatch<AppDispatch>();

const CouponsAndDeals: React.FC = () => {
    const dispatch = useAppDispatch();
  const coupons = useSelector((state: RootState) => selectCoupons(state));
  const { performance } = useSelector((state: RootState) => state.performance);
  const [isFormVisible, setFormVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch Coupons and Performance Data on Component Mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          dispatch(fetchCoupons()),
          dispatch(fetchPerformance()),
        ]);
      } catch (err) {
        setError("Failed to fetch data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

  const handleCreateCoupon = async (couponData: any) => {
    try {
      setLoading(true);
      await dispatch(createCoupon(couponData));
    } catch (err) {
      setError("Failed to create a new coupon.");
    } finally {
      setLoading(false);
      setFormVisible(false);
    }
  };

  const handleDeleteCoupon = async (couponId: string) => {
    try {
      setLoading(true);
      await dispatch(deleteCoupon(couponId));
    } catch (err) {
      setError("Failed to delete the coupon.");
    } finally {
      setLoading(false);
    }
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
        {coupons.map((coupon) => (
          <CouponCard
            key={coupon.id}
            coupon={coupon}
            onDelete={() => handleDeleteCoupon(coupon.id)}
          />
        ))}
      </div>

      <div className="performance-metrics">
        <h2>Performance Insights</h2>
        <p>Total Coupons Used: {performance?.couponsUsed || 0}</p>
        <p>Revenue From Coupons: ${performance?.couponRevenue || 0}</p>
      </div>
    </div>
  );
};

export default CouponsAndDeals;
