import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Form, Input, Select, Button, Checkbox, Alert, Spin } from "antd";
import {
  fetchPaymentMethods,
  savePaymentMethod,
  deletePaymentMethod,
  toggleCryptoAcceptance,
} from "../../redux/slices/orders/paymentSlice";
import { RootState } from "../../redux/store";
import { PaymentMethod } from "@/types/sharedTypes";
import {
  validateString,
  validateCardNumber,
  validateExpiryDate,
} from "../../utils/validationUtils";
import {
  FormContainer,
  FormTitle,
  CheckboxContainer,
  ButtonContainer,
  ErrorAlert,
  SpinContainer,
} from "./styles/PaymentMethodForm.styles";
import type { AppDispatch } from "../../redux/store";
import { CheckboxChangeEvent } from "antd/lib/checkbox"; // Correct import for CheckboxChangeEvent

const { Option } = Select;

interface PaymentMethodFormProps {
  existingMethod?: PaymentMethod;
  onClose?: () => void;
}

const PaymentMethodForm: React.FC<PaymentMethodFormProps> = ({ existingMethod, onClose }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch<AppDispatch>();
  const { paymentMethods, cryptoAccepted, loading, error } = useSelector(
    (state: RootState) => state.payments
  );

  const [cryptoEnabled, setCryptoEnabled] = useState(cryptoAccepted);

  useEffect(() => {
    if (!existingMethod) {
      dispatch(fetchPaymentMethods());
    }
  }, [dispatch, existingMethod]);

  const handleFinish = async (values: PaymentMethod) => {
    try {
      await dispatch(savePaymentMethod(values)).unwrap();
      form.resetFields();
      onClose?.();
    } catch (err) {
      console.error("Failed to save payment method:", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deletePaymentMethod(id)).unwrap();
      onClose?.();
    } catch (err) {
      console.error("Failed to delete payment method:", err);
    }
  };

  const handleCryptoToggle = async (e: CheckboxChangeEvent) => {
    const acceptCrypto = e.target.checked; // Extract the checked value
    try {
      const result = await dispatch(toggleCryptoAcceptance(acceptCrypto)).unwrap();
      setCryptoEnabled(result.success); // Update the state based on the response
    } catch (error) {
      console.error("Failed to toggle crypto acceptance:", error);
    }
  };

  return (
    <FormContainer>
      <FormTitle>{existingMethod ? "Edit Payment Method" : "Add Payment Method"}</FormTitle>
      {error && (
        <ErrorAlert>
          <Alert message={error} type="error" showIcon />
        </ErrorAlert>
      )}
      <Form
        form={form}
        layout="vertical"
        initialValues={existingMethod}
        onFinish={handleFinish}
      >
        <Form.Item
          label="Card Holder Name"
          name="cardHolderName"
          rules={[
            { required: true, message: "Please enter the card holder's name" },
            {
              validator: (_, value) =>
                validateString(value, "Card Holder Name", 3)
                  ? Promise.resolve()
                  : Promise.reject(new Error("Card holder name must be at least 3 characters")),
            },
          ]}
        >
          <Input placeholder="Card Holder Name" />
        </Form.Item>
        <Form.Item
          label="Card Type"
          name="cardType"
          rules={[{ required: true, message: "Please select a card type" }]}
        >
          <Select placeholder="Select a card type">
            <Option value="Visa">Visa</Option>
            <Option value="MasterCard">MasterCard</Option>
            <Option value="Amex">American Express</Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Card Number"
          name="cardNumber"
          rules={[
            { required: true, message: "Please enter the card number" },
            {
              validator: (_, value) =>
                validateCardNumber(value)
                  ? Promise.resolve()
                  : Promise.reject(new Error("Card number must be 16 digits")),
            },
          ]}
        >
          <Input placeholder="Card Number" maxLength={16} />
        </Form.Item>
        <Form.Item
          label="Expiry Date"
          name="expiryDate"
          rules={[
            { required: true, message: "Please enter the card expiry date" },
            {
              validator: (_, value) =>
                validateExpiryDate(value)
                  ? Promise.resolve()
                  : Promise.reject(new Error("Expiry date must be in MM/YY format and valid")),
            },
          ]}
        >
          <Input placeholder="MM/YY" />
        </Form.Item>
        <Form.Item
          label="Payment Method"
          name="method"
          rules={[{ required: true, message: "Please select a payment method" }]}
        >
          <Select placeholder="Select payment method">
            <Option value="creditCard">Credit Card</Option>
            <Option value="crypto">Cryptocurrency</Option>
            <Option value="escrow">Escrow</Option>
          </Select>
        </Form.Item>
        <CheckboxContainer>
          <Checkbox checked={cryptoEnabled} onChange={handleCryptoToggle}>
            Accept Cryptocurrency Payments
          </Checkbox>
        </CheckboxContainer>
        <ButtonContainer>
          {existingMethod && (
            <Button danger onClick={() => handleDelete(existingMethod.id)}>
              Delete
            </Button>
          )}
          <Button type="primary" htmlType="submit" loading={loading}>
            {existingMethod ? "Update" : "Save"}
          </Button>
        </ButtonContainer>
      </Form>
      {loading && (
        <SpinContainer>
          <Spin size="large" />
        </SpinContainer>
      )}
    </FormContainer>
  );
};

export default PaymentMethodForm;
