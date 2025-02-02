import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store"; 
import {
  nextStep,
  updateAccountDetails,
  submitAccountCreation
} from "../../../redux/slices/auth/sellerRegistrationSlice";
import { validateString } from "../../../utils/validationUtils";
import { getLocalizedText } from "../../../utils/localizationUtils";


// Import styled components
import {
  FormContainer,
  FormTitle,
  Label,
  Input,
  ErrorText,
  SubmitButton,
  BackButton
} from "./SellerAccountFormStyles";

const SellerAccountForm: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>(); 
  const { accountDetails, loading, error } = useSelector((state: RootState) => state.sellerRegistration);
  
  const [formData, setFormData] = useState(accountDetails);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Log form updates for debugging
  useEffect(() => {
    console.log("Form Data Updated:", formData);
  }, [formData]);

  // Handle input changes and persist to Redux
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle confirmation password input
  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors: { [key: string]: string } = {};

    if (!validateString(formData.full_name, "Full Name")) {
      validationErrors.full_name = getLocalizedText("Full Name is required", "chatbot");
    }
    if (!validateString(formData.email, "Email")) {
      validationErrors.email = getLocalizedText("Valid Email is required", "chatbot");
    }
    if (!validateString(formData.password, "Password", 6)) {
      validationErrors.password = getLocalizedText("Password must be at least 6 characters", "chatbot");
    }
    if (formData.password !== confirmPassword) {
      validationErrors.confirmPassword = getLocalizedText("Passwords do not match", "chatbot");
    }

    if (Object.keys(validationErrors).length > 0) {
      console.error("Validation Errors:", validationErrors);
      setErrors(validationErrors);
      return;
    }

    // Save to Redux
    dispatch(updateAccountDetails(formData));
    dispatch(submitAccountCreation(formData));
  };

  return (
    <FormContainer>
      <FormTitle>{getLocalizedText("Create Your Seller Account", "chatbot")}</FormTitle>

      <form onSubmit={handleSubmit}>
        <Label>{getLocalizedText("Full Name", "chatbot")}</Label>
        <Input type="text" name="full_name" value={formData.full_name} onChange={handleChange} />
        {errors.full_name && <ErrorText>{errors.full_name}</ErrorText>}

        <Label>{getLocalizedText("Email", "chatbot")}</Label>
        <Input type="email" name="email" value={formData.email} onChange={handleChange} />
        {errors.email && <ErrorText>{errors.email}</ErrorText>}

        <Label>{getLocalizedText("Password", "chatbot")}</Label>
        <Input type="password" name="password" value={formData.password} onChange={handleChange} />
        {errors.password && <ErrorText>{errors.password}</ErrorText>}

        <Label>{getLocalizedText("Confirm Password", "chatbot")}</Label>
        <Input type="password" name="confirmPassword" value={confirmPassword} onChange={handleConfirmPasswordChange} />
        {errors.confirmPassword && <ErrorText>{errors.confirmPassword}</ErrorText>}

        <SubmitButton type="submit" disabled={loading}>
          {loading ? getLocalizedText("Submitting...", "chatbot") : getLocalizedText("Next", "chatbot")}
        </SubmitButton>

        {error && <ErrorText>{error}</ErrorText>}
      </form>

      <BackButton onClick={() => dispatch(nextStep())}>
        {getLocalizedText("Back", "chatbot")}
      </BackButton>
    </FormContainer>
  );
};

export default SellerAccountForm;
