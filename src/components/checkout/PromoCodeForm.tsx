import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Form } from "antd";
import { applyPromoCode, clearPromoCode } from "../../redux/slices/marketing/promoSlice";
import {
  PromoContainer,
  PromoText,
  PromoAlert,
  PromoForm,
  PromoInput,
  PromoButton,
} from "./styles/PromoCodeForm.styles";
import type { AppDispatch, RootState } from "../../redux/store";

const PromoCodeForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { promoCode, discount, loading, error } = useSelector(
    (state: RootState) => state.promoCode
  );
  const [inputCode, setInputCode] = useState("");

  const handleApplyPromo = () => {
    if (inputCode.trim() === "") {
      alert("Please enter a promo code");
      return;
    }
    dispatch(applyPromoCode(inputCode));
  };

  const handleClearPromo = () => {
    dispatch(clearPromoCode());
    setInputCode(""); // Clear the input field
  };

  return (
    <PromoContainer>
      <PromoText>Have a Promo Code or Gift Card?</PromoText>
      {promoCode && (
        <PromoAlert>
          <Alert
            message={`Promo Code Applied: ${promoCode} - Discount: ${discount}%`}
            type="success"
            showIcon
          />
        </PromoAlert>
      )}
      {error && (
        <PromoAlert>
          <Alert message={error} type="error" showIcon />
        </PromoAlert>
      )}
      <PromoForm>
        <Form layout="inline">
          <Form.Item>
            <PromoInput
              placeholder="Enter promo code"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              disabled={loading || !!promoCode} // This should now work
            />
          </Form.Item>
          {!promoCode ? (
            <Form.Item>
              <PromoButton
                type="button"
                onClick={handleApplyPromo}
                loading={loading} // This should now work
                disabled={loading}
              >
                {loading ? "Loading..." : "Apply"}
              </PromoButton>
            </Form.Item>
          ) : (
            <Form.Item>
              <PromoButton
                type="button" // Valid type for a button
                onClick={handleClearPromo}
              >
                Clear Promo
              </PromoButton>
            </Form.Item>
          )}
        </Form>
      </PromoForm>
    </PromoContainer>
  );
};

export default PromoCodeForm;
