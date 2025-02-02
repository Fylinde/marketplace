import React from "react";
import styled from "styled-components";

interface Coupon {
  id: string;
  title: string;
  discount: string;
  expiryDate: string;
}

interface CouponCardProps {
  coupon: Coupon;
  onDelete: () => void;
}

const Card = styled.div`
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
`;

const Title = styled.h3`
  font-size: 1.25rem;
  color: #333333;
  margin-bottom: 8px;
`;

const Text = styled.p`
  font-size: 1rem;
  color: #666666;
  margin: 4px 0;
`;

const DeleteButton = styled.button`
  background-color: #ff4d4f;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 0.875rem;
  cursor: pointer;
  margin-top: 12px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #e60000;
  }

  &:focus {
    outline: none;
  }
`;

export const CouponCard: React.FC<CouponCardProps> = ({ coupon, onDelete }) => (
  <Card>
    <Title>{coupon.title}</Title>
    <Text>Discount: {coupon.discount}</Text>
    <Text>Expiry Date: {coupon.expiryDate}</Text>
    <DeleteButton onClick={onDelete}>Delete</DeleteButton>
  </Card>
);
