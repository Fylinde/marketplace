import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../../redux/store";
import { saveBusinessDocumentation } from "../../redux/slices/auth/registrationSlice";
import SellerRegistrationLayout from "../layout/SellerRegistrationLayout";
import BusinessDocumentationForm from "../Registration/CompanyForms/BusinessDocumentationForm";
import { BusinessDocumentation as BusinessDocumentationType } from "../../types/sharedTypes";

// Define the props interface
interface BusinessDocumentationStepProps {
  registrationData: {
    documentNumber?: string;
    issuingAuthority?: string;
    taxIdNumber?: string;
    taxCountryOfResidence?: string;
    businessRegistrationDocument?: File;
    taxDocument?: File;
  };
  updateStep: (step: string, data?: Record<string, any>) => void;
}

const BusinessDocumentationStep: React.FC<BusinessDocumentationStepProps> = ({
  registrationData,
  updateStep,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // Initialize form state with provided registrationData or default values
  const [formData, setFormData] = useState<BusinessDocumentationType>({
    documentNumber: registrationData.documentNumber || "",
    issuingAuthority: registrationData.issuingAuthority || "",
    taxIdNumber: registrationData.taxIdNumber || "",
    taxCountryOfResidence: registrationData.taxCountryOfResidence || "",
    businessRegistrationDocument: registrationData.businessRegistrationDocument,
    taxDocument: registrationData.taxDocument,
  });

  // Update Redux state whenever formData changes
  useEffect(() => {
    dispatch(saveBusinessDocumentation(formData));
  }, [formData, dispatch]);

  // Handle form field updates
  const handleUpdate = (updatedData: Partial<BusinessDocumentationType>) => {
    setFormData((prevData) => ({
      ...prevData,
      ...updatedData,
    }));
  };

  // Handle navigation to the next step
  const handleNext = () => {
    updateStep("acknowledgment", formData); // Pass the current data to the next step
    navigate("/register/seller/professional/acknowledgment");
  };

  return (
    <SellerRegistrationLayout currentStep="Business Documentation">
      <BusinessDocumentationForm
        data={formData}
        onUpdate={handleUpdate}
        onNext={handleNext}
      />
    </SellerRegistrationLayout>
  );
};

export default BusinessDocumentationStep;
