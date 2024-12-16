import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Input, Button, Select, Alert, Spin, Typography } from "antd";
import { setShippingAddress, fetchShippingMethods } from "../../redux/slices/logistics/shippingSlice";
import { RootState } from "../../redux/store";
import shippingCalculator from "../../utils/shippingCalculator";
import {
  validateString,
  validatePostalCode,
  validateCountry,
} from "../../utils/validationUtils";
import {
  ShippingFormContainer,
  ShippingForm,
  ShippingCostSummary,
  SaveButton,
  ErrorMessage,
  LoadingSpinner,
} from "./styles/ShippingAddressForm.styles";
import type { AppDispatch } from "../../redux/store";


const { Option } = Select;
const { Text } = Typography;

const ShippingAddressForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { methods, loading, error, shippingAddress } = useSelector(
    (state: RootState) => state.shipping
  );

  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [shippingCost, setShippingCost] = useState<number | null>(null);
  const [estimatedDelivery, setEstimatedDelivery] = useState<string | null>(null);
  const [calculating, setCalculating] = useState(false);

  useEffect(() => {
    if (!methods.length) {
      dispatch(fetchShippingMethods({ country: "US", currency: "USD" }));
    }
  }, [dispatch, methods.length]);

  const getValidAddress = (address: any) => {
    return address && address.country
      ? address
      : {
        country: "US", // Default country
        state: "CA", // Default state
        city: "San Francisco", // Default city
        postalCode: "94103", // Default postal code
      };
  };


  const handleShippingMethodChange = async (methodId: string) => {
    setSelectedMethod(methodId);
    setCalculating(true);

    try {
      const validAddress = getValidAddress(shippingAddress);
      const shippingData = await shippingCalculator.calculateShipping({
        methodId,
        address: validAddress,
        cartTotal: 100, // Replace with actual cart total
      });

      setShippingCost(shippingData.shippingCost);
      setEstimatedDelivery(shippingData.estimatedDelivery);
    } catch (error) {
      console.error("Error calculating shipping:", error);
    } finally {
      setCalculating(false);
    }
  };



  const handleFinish = async (values: any) => {
    dispatch(
      setShippingAddress({
        ...values,
        selectedMethod,
        shippingCost,
        estimatedDelivery,
      })
    );
  };

  return (
    <ShippingFormContainer>
      <h3>Shipping Address</h3>
      {error && (
        <ErrorMessage>
          <Alert message={error} type="error" showIcon />
        </ErrorMessage>
      )}
      <Spin spinning={loading}>
        <Form
          layout="vertical"
          onFinish={handleFinish}
          initialValues={shippingAddress || {}}
        >
          <ShippingForm>
            <Form.Item
              label="Country"
              name="country"
              rules={[
                { required: true, message: "Please select a country" },
                {
                  validator: (_, value) =>
                    validateCountry(value)
                      ? Promise.resolve()
                      : Promise.reject(new Error("Invalid country selection")),
                },
              ]}
            >
              <Select placeholder="Select a country">
                <Option value="US">United States</Option>
                <Option value="CA">Canada</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="State/Province"
              name="state"
              rules={[
                { required: true, message: "Please enter your state or province" },
                {
                  validator: (_, value) =>
                    validateString(value, "State", 2)
                      ? Promise.resolve()
                      : Promise.reject(new Error("State must be at least 2 characters")),
                },
              ]}
            >
              <Input placeholder="State/Province" />
            </Form.Item>

            <Form.Item
              label="City"
              name="city"
              rules={[
                { required: true, message: "Please enter your city" },
                {
                  validator: (_, value) =>
                    validateString(value, "City", 2)
                      ? Promise.resolve()
                      : Promise.reject(new Error("City must be at least 2 characters")),
                },
              ]}
            >
              <Input placeholder="City" />
            </Form.Item>

            <Form.Item
              label="Postal Code"
              name="postalCode"
              rules={[
                { required: true, message: "Please enter your postal code" },
                {
                  validator: (_, value) =>
                    validatePostalCode(value)
                      ? Promise.resolve()
                      : Promise.reject(new Error("Invalid postal code format")),
                },
              ]}
            >
              <Input placeholder="Postal Code" />
            </Form.Item>

            <Form.Item
              label="Address Line 1"
              name="addressLine1"
              rules={[
                { required: true, message: "Please enter your address" },
                {
                  validator: (_, value) =>
                    validateString(value, "Address Line 1", 5)
                      ? Promise.resolve()
                      : Promise.reject(
                        new Error("Address Line 1 must be at least 5 characters")
                      ),
                },
              ]}
            >
              <Input placeholder="Address Line 1" />
            </Form.Item>

            <Form.Item label="Address Line 2" name="addressLine2">
              <Input placeholder="Address Line 2 (Optional)" />
            </Form.Item>

            <Form.Item
              label="Shipping Method"
              name="shippingMethod"
              rules={[{ required: true, message: "Please select a shipping method" }]}
            >
              <Select
                placeholder="Select a shipping method"
                onChange={handleShippingMethodChange}
              >
                {methods.map((method) => (
                  <Option key={method.id} value={method.id}>
                    {`${method.name} - $${method.rate.toFixed(2)} (${method.estimatedDelivery})`}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </ShippingForm>

          {calculating ? (
            <LoadingSpinner>Calculating shipping cost...</LoadingSpinner>
          ) : (
            shippingCost !== null && (
              <ShippingCostSummary>
                <span>Shipping Cost: ${shippingCost.toFixed(2)}</span>
                <span>Estimated Delivery: {estimatedDelivery}</span>
              </ShippingCostSummary>
            )
          )}

          <SaveButton>
            <Button type="primary" htmlType="submit">
              Save Address
            </Button>
          </SaveButton>
        </Form>
      </Spin>
    </ShippingFormContainer>
  );
};

export default ShippingAddressForm;
