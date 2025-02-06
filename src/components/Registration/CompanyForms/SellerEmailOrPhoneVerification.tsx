import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store"; 
import { verifyOTP, resendOTP } from "../../../redux/slices/auth/sellerRegistrationSlice";
import { getLocalizedText } from "../../../utils/localizationUtils";

// Import styled components
import {
    FormContainer,
    FormTitle,
    Label,
    Input,
    ErrorText,
    SubmitButton,
    ResendButton
} from "./SellerEmailOrPhoneVerificationStyles";

const SellerEmailOrPhoneVerification: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>(); 

    // ✅ Add fallback in case Redux is not ready
    const verification = useSelector((state: RootState) => state.sellerRegistration?.verification) || {
        emailOrPhone: "",
        verificationCode: "",
        isVerified: false,
        verificationStatus: "pending",
        verificationError: null,
        expirationTime: null,
    };

    // ✅ Use fallback if verification is undefined
    const { emailOrPhone, loading, verificationError } = verification;

    const [otp, setOtp] = useState("");
    const [resendDisabled, setResendDisabled] = useState(false);

    // Auto-submit when 6-digit OTP is entered
    useEffect(() => {
        if (otp.length === 6) {
            handleVerifyOTP();
        }
    }, [otp]);

    // Handle OTP input change
    const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOtp(e.target.value);
    };

    // Submit OTP for verification
    const handleVerifyOTP = () => {
        if (otp.length !== 6) return;
        dispatch(verifyOTP({ emailOrPhone: emailOrPhone ?? "", verificationCode: otp }));
    };

    // Resend OTP
    const handleResendOTP = () => {
        dispatch(resendOTP(emailOrPhone ?? ""));
        setResendDisabled(true);
        setTimeout(() => setResendDisabled(false), 30000); // Disable for 30s
    };

    return (
        <FormContainer>
            <FormTitle>{getLocalizedText("Verify Your Account", "chatbot")}</FormTitle>

            <Label>{getLocalizedText("Enter the OTP sent to", "chatbot")} {emailOrPhone}</Label>
            <Input type="text" value={otp} onChange={handleOtpChange} maxLength={6} placeholder="123456" />

            {verificationError && <ErrorText>{verificationError}</ErrorText>}

            <SubmitButton onClick={handleVerifyOTP} disabled={!!loading || otp.length < 6}>
                {loading ? getLocalizedText("Verifying...", "chatbot") : getLocalizedText("Verify", "chatbot")}
            </SubmitButton>

            <ResendButton onClick={handleResendOTP} disabled={resendDisabled}>
                {resendDisabled ? getLocalizedText("Wait 30s to resend", "chatbot") : getLocalizedText("Resend OTP", "chatbot")}
            </ResendButton>
        </FormContainer>
    );
};


export default SellerEmailOrPhoneVerification;
