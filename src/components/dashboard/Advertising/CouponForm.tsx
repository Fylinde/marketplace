import React, { useState } from "react";
import styled from "styled-components";

interface CouponFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 24px;
  max-width: 400px;
  margin: auto;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h3`
  font-size: 1.5rem;
  color: #333333;
  margin-bottom: 16px;
`;

const Label = styled.label`
  font-size: 1rem;
  color: #666666;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Input = styled.input`
  padding: 8px;
  font-size: 1rem;
  border: 1px solid #cccccc;
  border-radius: 4px;
  &:focus {
    border-color: #007bff;
    outline: none;
    box-shadow: 0 0 4px rgba(0, 123, 255, 0.5);
  }
`;

const Button = styled.button<{ variant?: "primary" | "secondary" }>`
  padding: 10px 16px;
  font-size: 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  ${({ variant }) =>
    variant === "primary"
      ? `
    background-color: #007bff;
    color: #ffffff;
    &:hover {
      background-color: #0056b3;
    }
  `
      : `
    background-color: #f5f5f5;
    color: #333333;
    &:hover {
      background-color: #e0e0e0;
    }
  `}

  &:focus {
    outline: none;
  }
`;

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
    <Form onSubmit={handleSubmit}>
      <Title>Create New Coupon</Title>
      <Label>
        Title:
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </Label>
      <Label>
        Discount:
        <Input
          type="text"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
          required
        />
      </Label>
      <Label>
        Expiry Date:
        <Input
          type="date"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
          required
        />
      </Label>
      <Button type="submit" variant="primary">
        Create
      </Button>
      <Button type="button" variant="secondary" onClick={onCancel}>
        Cancel
      </Button>
    </Form>
  );
};
