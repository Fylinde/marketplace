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
import { AccountDetails } from "../../../types/sharedTypes";

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
  const sellerRegistration = useSelector((state: RootState) => state.sellerRegistration);

  // ✅ Ensure `seller_type` has a default value
  const [formData, setFormData] = useState<AccountDetails>({
      full_name: "",
      email: "",
      phoneNumber: "",
      password: "",
      seller_type: "professional",  // ✅ Default value
      currency_code: "USD",
      is_email_verified: false,
      is_phone_verified: false,
      profile_picture: null,
      preferences: null,
      verification_code: null,
      verification_expiration: null
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
      console.log("Form Data Updated:", formData);
  }, [formData]);

  // ✅ Ensure `seller_type` is correctly updated
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;

      const updatedValue = name === "seller_type"
          ? (value === "professional" ? "Professional" : "Individual")  // ✅ Fix casing
          : value;

      setFormData((prev) => ({
          ...prev,
          [name]: updatedValue
      }));
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      let validationErrors: { [key: string]: string } = {};

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
          setErrors(validationErrors);
          return;
      }

      const accountData: AccountDetails = {
          full_name: formData.full_name,
          email: formData.email,
          password: formData.password,
          phoneNumber: formData.phoneNumber,
          seller_type: formData.seller_type.toLowerCase() as "individual" | "professional",  // ✅ Convert to lowercase
          currency_code: formData.currency_code || "USD",
          is_email_verified: false,
          is_phone_verified: false,
          profile_picture: null,
          preferences: null,
          verification_code: null,
          verification_expiration: null
      };

      console.log("Dispatching API call with:", accountData);
      dispatch(updateAccountDetails(accountData));
      dispatch(submitAccountCreation(accountData));  // ✅ API Call
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

              <Label>{getLocalizedText("Seller Type", "chatbot")}</Label>
              <select name="seller_type" value={formData.seller_type} onChange={handleChange}>
                  <option value="professional">{getLocalizedText("Professional", "chatbot")}</option>
                  <option value="individual">{getLocalizedText("Individual", "chatbot")}</option>
              </select>

              <SubmitButton type="submit">
                  {getLocalizedText("Submit", "chatbot")}
              </SubmitButton>
          </form>

          <BackButton onClick={() => dispatch(nextStep())}>
              {getLocalizedText("Back", "chatbot")}
          </BackButton>
      </FormContainer>
  );
};

export default SellerAccountForm;
