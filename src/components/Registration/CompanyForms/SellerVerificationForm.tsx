import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState, AppDispatch } from "../../../redux/store";
import { verifySellerCodeThunk } from "../../../redux/slices/auth/registrationSlice";
import { Container, Title, Input, Button, Message } from "./SellerVerificationFormWrapper";
import { SellerVerification } from "../../../types/sharedTypes";

interface SellerVerificationFormProps {
  data: SellerVerification;
  onUpdate: (data: Partial<SellerVerification>) => void;
}

const SellerVerificationForm: React.FC<SellerVerificationFormProps> = ({ data, onUpdate }) => {
  const [code, setCode] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const storedEmail = useSelector((state: RootState) => {
    console.log("[DEBUG] Redux accountDetails:", state.registration.accountDetails);
    return state.registration.accountDetails?.email || data.email;
  });

  const { isVerified, verificationError } = useSelector(
    (state: RootState) => state.registration
  );

  useEffect(() => {
    if (!storedEmail) {
      console.error("[ERROR] No email found for verification.");
    }
  }, [storedEmail]);

  const handleVerification = async () => {
    try {
      if (!storedEmail) {
        console.error("[ERROR] No email found for verification.");
        return;
      }

      console.log("[DEBUG] Dispatching verifySellerCodeThunk with:", { email: storedEmail, code });
      const result = await dispatch(verifySellerCodeThunk({ email: storedEmail, code })).unwrap();

      console.log("[DEBUG] Verification Response:", result);
      if (result?.isVerified) {
        console.log("[DEBUG] Verification successful! Navigating to next step...");
        navigate("/register/seller/professional/combined-information");
      }
    } catch (error) {
      console.error("[ERROR] Verification failed:", error);
    }
  };

  return (
    <Container>
      <Title>Verify Your Account</Title>
      <Input
        type="text"
        placeholder="Enter verification code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <Button onClick={handleVerification}>Verify</Button>
      {storedEmail && <Message>Email: {storedEmail}</Message>}
      {isVerified && <Message>Verification Successful!</Message>}
      {verificationError && <Message isError>{verificationError}</Message>}
    </Container>
  );
};

export default SellerVerificationForm;
