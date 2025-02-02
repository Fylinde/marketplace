import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  saveAccountDetails,
  setSellerVerificationEmail,
  setCurrentStep,
  selectEmailLinkExpiration,
  registerSellerThunk,
  setSellerId,
  verifySellerCodeThunk,
  setSellerVerificationCode,
} from "../../redux/slices/auth/registrationSlice";
import { AccountDetails } from "../../types/sharedTypes";
import { AppDispatch, RootState } from "../../redux/store"; // Adjust the path if needed
import styled from "styled-components";
import { getLocalizedText } from "../../utils/localizationUtils";
import {
  Container,
  Title,
  Form,
  Button,
  FormGroup,
  Link,
  Label,
  Input,
  SmallText,
  ErrorMessage,
  InfoText, StyledLink
} from "./CreateSellerAccountStyled";




interface CreateSellerAccountProps {
  data: AccountDetails;
  onUpdate: (updatedData: Partial<AccountDetails>) => void;
  onNext: () => void;
  onSubmit?: (accountDetailsData: AccountDetails) => void;
}

const CreateSellerAccount: React.FC<CreateSellerAccountProps> = ({
  data,
  onUpdate,
  onNext,
  onSubmit,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const emailLinkExpiration = useSelector(selectEmailLinkExpiration);
  const sellerType = useSelector((state: RootState) => state.registration.sellerType);
  const storedEmail = useSelector((state: RootState) => state.registration.email);

  const [full_name, setName] = useState(data.full_name || "");
  const [email, setEmail] = useState(data.email || "");
  const [password, setPassword] = useState(data.password || "");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitRef = useRef(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  console.log("[CreateSellerAccount] Component Mounted.");
  console.log("[Redux State] Initial Values: ", { sellerType, storedEmail });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get("code");

    console.log("[CreateSellerAccount] useEffect Triggered.");
    console.log("[URL Query Params] Code:", code);
    console.log("[Current Pathname]", location.pathname);

    if (!code || location.pathname !== "/register/seller/professional/seller-verification") {
      console.log("[CreateSellerAccount] No verification code or invalid path.");
      return;
    }

    const validateCode = async () => {
      try {
        const emailToUse = storedEmail ?? "";
        console.log("[CreateSellerAccount] Validating verification code:", { code, email: emailToUse });

        const response = await dispatch(verifySellerCodeThunk({ code, email: emailToUse })).unwrap();
        console.log("[Verification API Response]", response);

        if (response.isVerified) {

          console.log("[Verification] Success. Saving verification data to Redux.");
          dispatch(setSellerVerificationCode(code));
          dispatch(setSellerVerificationEmail(email));

          dispatch(setCurrentStep("Combined Information"));
          navigate("/register/seller/professional/combined-information");
        } else {
          console.warn("[Verification] Invalid verification code.");
          setErrorMessage(getLocalizedText("invalid_verification_code", "auth"));
        }
      } catch (error) {
        console.error("[Verification] Error validating code:", error);
        setErrorMessage(getLocalizedText("error_validating_code", "auth"));
      }
    };

    validateCode();
  }, [dispatch, location, navigate, storedEmail]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("[CreateSellerAccount] Form Submission Attempt.");
  
    if (password !== confirmPassword) {
      setErrorMessage(getLocalizedText("passwords_do_not_match", "auth"));
      return;
    }
  
    if (!sellerType) {
      setErrorMessage(getLocalizedText("seller_type_missing", "auth"));
      return;
    }
  
    if (isSubmitting || submitRef.current) {
      console.warn("[Submission] Duplicate form submission prevented.");
      return;
    }
  
    submitRef.current = true;
    setIsSubmitting(true);
    setErrorMessage(null);
  
    try {
      console.log("[CreateSellerAccount] Dispatching account registration.");
      const accountDetailsData: AccountDetails = { full_name, email, password };
  
      if (onSubmit) {
        onSubmit(accountDetailsData);
      }
  
      const resultAction = await dispatch(
        registerSellerThunk({ full_name, email, password, seller_type: sellerType })
      ).unwrap();
  
      console.log("[Registration API Response]", resultAction);
  
      // Ensure registration was successful before proceeding
      if (!resultAction || !resultAction.sellerId) {
        console.error("[Registration Failed] Seller ID missing or API returned an error.");
        setErrorMessage(getLocalizedText("registration_failed", "auth"));
        return; // 🚨 Stops navigation
      }
  
      console.log("[Success] Saving registration details to Redux.");
      dispatch(setSellerId(resultAction.sellerId));
      dispatch(saveAccountDetails(accountDetailsData));
      dispatch(setSellerVerificationEmail(email));
  
      setSuccessMessage(getLocalizedText("account_created_success", "auth"));
  
      // ✅ Ensure navigation ONLY happens when successful
      setTimeout(() => {
        onNext();
      }, 2000);
    } catch (error: any) {
      console.error("[CreateSellerAccount] Error during registration:", error);
  
      // ✅ Ensure we correctly stop execution on errors
      setIsSubmitting(false);
      submitRef.current = false;
  
      let errorMessage = "An unexpected error occurred.";
  
      // **Safely check for error response from backend**
      if (error?.response) {
        console.error("[Backend Error] Response received:", error.response.data);
        errorMessage = error.response.data?.message || "Failed to register seller.";
      }
      // **Handle network errors (no response from server)**
      else if (error?.request) {
        console.error("[Network Error] No response received from server.");
        errorMessage = "Unable to connect to the server. Please try again later.";
      }
      // **Handle unexpected cases**
      else if (error?.message) {
        errorMessage = error.message;
      }
  
      // Prevent undefined `.includes()` crash
      if (typeof errorMessage === "string" && errorMessage.includes("already exists")) {
        setErrorMessage("This email is already registered. Try logging in.");
      } else {
        setErrorMessage(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
      submitRef.current = false;
    }
  };
  
  

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Title>{getLocalizedText("Create Seller Account", "auth")}</Title>
        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}

        <FormGroup>
          <Label htmlFor="full_name">{getLocalizedText("Your Full Name", "auth")}</Label>
          <Input
            type="text"
            id="full_name"
            placeholder={getLocalizedText("enter_name", "auth")}
            value={full_name}
            onChange={(e) => {
              setName(e.target.value);
              onUpdate({ full_name: e.target.value });
            }}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="email">{getLocalizedText("Email", "auth")}</Label>
          <Input
            type="email"
            id="email"
            placeholder={getLocalizedText("enter_email", "auth")}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              onUpdate({ email: e.target.value });
            }}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="password">{getLocalizedText("Password", "auth")}</Label>
          <Input
            type="password"
            id="password"
            placeholder={getLocalizedText("password_placeholder", "auth")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <SmallText>{getLocalizedText("password_hint", "auth")}</SmallText>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="confirmPassword">{getLocalizedText("Reenter Password", "auth")}</Label>
          <Input
            type="password"
            id="confirmPassword"
            placeholder={getLocalizedText("confirm_password_placeholder", "auth")}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </FormGroup>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? getLocalizedText("Submitting", "auth") : getLocalizedText("Next", "auth")}
        </Button>
      </Form>

      <InfoText>
        {getLocalizedText("terms_conditions", "auth")}{" "}
        <Link href="#">{getLocalizedText("privacy_policy", "auth")}</Link>.
      </InfoText>

      <InfoText>
        {getLocalizedText("already_have_account", "auth")}{" "}
        <Link onClick={() => navigate("/sign-in")}>{getLocalizedText("sign_in", "auth")}</Link>
      </InfoText>
    </Container>
  );
};

export default CreateSellerAccount;
