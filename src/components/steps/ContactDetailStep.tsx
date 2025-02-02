import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import {
  setCurrentStep,
  sendRegistrationEmail,
  validateLinkExpiration,
} from "../../redux/slices/auth/registrationSlice";
import LinearProgress from "../progressbar/LinearProgress";
import ContactDetailsForm from "../Registration/ContactDetailsForm"; // Import the form
import { ContactDetails } from "@/types/sharedTypes";


interface StepProps {
  registrationData: Record<string, any>;
  updateStep: (step: string, data?: Record<string, any>) => void;
}

const steps = ["create_account", "contact_details", "payment_details", "confirmation"];

const ContactDetailsStep: React.FC<StepProps> = ({ registrationData, updateStep }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { currentStep, emailLinkExpiration } = useSelector(
    (state: RootState) => state.registration
  );

  // Map registrationData to ContactDetails type
  const contactDetails: ContactDetails = {
    firstName: registrationData.firstName || "",
    middleName: registrationData.middleName || "",
    lastName: registrationData.lastName || "",
    countryOfCitizenship: registrationData.countryOfCitizenship || "",
    countryOfResidence: registrationData.countryOfResidence || "",
    residentialAddress: registrationData.residentialAddress || "",
    postalCode: registrationData.postalCode || "",
    building: registrationData.building || "",
    state: registrationData.state || "",
    phoneNumber: registrationData.phoneNumber || "",
    dateOfBirth: registrationData.dateOfBirth || { day: "", month: "", year: "" },
    additionalAddressInfo: registrationData.additionalAddressInfo || {
      secondaryAddress: "",
      secondaryPostalCode: "",
      secondaryBuilding: "",
      secondaryState: "",
    },
    passportInfo: registrationData.passportInfo || {
      passportNumber: "",
      countryOfIssue: "",
      expiryDate: { day: "", month: "", year: "" },
    },
  };

  // Set the current step on mount
  useEffect(() => {
    dispatch(setCurrentStep("contact_details"));
  }, [dispatch]);

  // Validate link expiration
  useEffect(() => {
    dispatch(validateLinkExpiration());
    if (!emailLinkExpiration) {
      navigate("/register/seller/create-account");
    }
  }, [dispatch, emailLinkExpiration, navigate]);

  // Update data during form interactions
  const handleUpdate = (updatedData: Partial<ContactDetails>) => {
    updateStep("contact_details", { ...registrationData, ...updatedData });
  };

  // Handle submission and move to the next step
  const handleSubmit = () => {
    dispatch(sendRegistrationEmail("contact_details"));
    updateStep("payment_details", registrationData);
  };

  return (
    <div>
      <h1>Contact Details</h1>
      {/* Progress Bar */}
      <LinearProgress
        value={((steps.indexOf(currentStep) + 1) / steps.length) * 100}
        color="dynamic"
        thickness={10}
        label="Registration Progress"
        showValue
      />
      {/* Embed the existing form */}
      <ContactDetailsForm
        data={contactDetails} // Pass transformed data
        onUpdate={handleUpdate} // Handle incremental updates
        onNext={handleSubmit} // Handle form submission
      />
    </div>
  );
};

export default ContactDetailsStep;
