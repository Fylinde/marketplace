import React, { useState } from "react";
import styled from "styled-components";
import Spinner from "../../../components/Spinner";
import { CouponCard } from "./CouponCard";
import { CouponForm } from "./CouponForm";

interface Coupon {
  id: string;
  title: string;
  discount: string;
  expiryDate: string;
}

interface CouponsAndDealsProps {
  coupons: Coupon[];
  performance: {
    couponsUsed: number;
    couponRevenue: number;
  };
  onDeleteCoupon: (couponId: string) => void;
}

const Container = styled.div`
  padding: 24px;
  max-width: 800px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;

  h1 {
    font-size: 1.5rem;
    color: #333;
  }
`;

const Button = styled.button`
  padding: 10px 16px;
  font-size: 1rem;
  color: #ffffff;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }

  &:focus {
    outline: none;
  }
`;

const ErrorMessage = styled.div`
  color: #ff4d4f;
  background-color: #fff2f0;
  border: 1px solid #ffccc7;
  border-radius: 4px;
  padding: 8px 16px;
  margin-bottom: 16px;
`;

const CouponsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 16px;
`;

const PerformanceMetrics = styled.div`
  margin-top: 24px;

  h2 {
    font-size: 1.25rem;
    color: #333;
    margin-bottom: 8px;
  }

  p {
    font-size: 1rem;
    color: #666;
    margin: 4px 0;
  }
`;

const CouponsAndDeals: React.FC<CouponsAndDealsProps> = ({
  coupons,
  performance,
  onDeleteCoupon,
}) => {
  const [isFormVisible, setFormVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreateCoupon = (newCoupon: Coupon) => {
    console.log("New Coupon Created", newCoupon);
    setFormVisible(false);
  };

  if (loading) return <Spinner />;

  return (
    <Container>
      <Header>
        <h1>Coupons & Deals Management</h1>
        <Button onClick={() => setFormVisible(!isFormVisible)}>
          {isFormVisible ? "Cancel" : "Create New Coupon"}
        </Button>
      </Header>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      {isFormVisible && (
        <CouponForm
          onSubmit={handleCreateCoupon}
          onCancel={() => setFormVisible(false)}
        />
      )}

      <CouponsContainer>
        {coupons.map((coupon: Coupon) => (
          <CouponCard
            key={coupon.id}
            coupon={coupon}
            onDelete={() => onDeleteCoupon(coupon.id)}
          />
        ))}
      </CouponsContainer>

      <PerformanceMetrics>
        <h2>Performance Insights</h2>
        <p>Total Coupons Used: {performance.couponsUsed}</p>
        <p>Revenue From Coupons: ${performance.couponRevenue}</p>
      </PerformanceMetrics>
    </Container>
  );
};

export default CouponsAndDeals;
