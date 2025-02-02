import React, { useState, useEffect } from "react";
import {
  CombinedFormWrapper,
  FormTitle,
  FormGroup,
  SubmitButton,
} from "./CombinedInformationFormWrapper";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../redux/store";
import { updateRegistrationData } from "../../../redux/slices/auth/registrationSlice";

interface CombinedInformationFormProps {
  data: {
    businessLocation?: string;
    businessType?: string;
    businessName?: string;
    companyName?: string;
    companyRegistrationNumber?: string;
    countryOfIncorporation?: string;
    businessAddress?: string;
    phoneNumber?: string;
    contactPersonFirstName?: string;
    contactPersonMiddleName?: string;
    contactPersonLastName?: string;
    smsVerificationLanguage?: string;
    verificationMethod?: string;
    businessIndustry?: string;
    yearsInOperation?: number;
    businessWebsite?: string;
    altPhoneNumber?: string;
  };
  onUpdate: (newData: Partial<CombinedInformationFormProps["data"]>) => void;
  onSubmit: () => void;
  onNext: () => void;
}

const CombinedInformationForm: React.FC<CombinedInformationFormProps> = ({
  data,
  onUpdate,
  onSubmit,
  onNext,
}) => {
  const savedData = useSelector((state: RootState) => state.registration.sellerVerification);
  const [formData, setFormData] = useState({
    businessLocation: data.businessLocation || savedData.businessLocation || "",
    businessType: data.businessType || savedData.businessType || "",
    businessName: data.businessName || savedData.businessName || "",
    companyName: data.companyName || savedData.companyName || "",
    companyRegistrationNumber: data.companyRegistrationNumber || savedData.companyRegistrationNumber || "",
    countryOfIncorporation: data.countryOfIncorporation || savedData.countryOfIncorporation || "",
    businessAddress: data.businessAddress || savedData.businessAddress || "",
    phoneNumber: data.phoneNumber || savedData.phoneNumber || "",
    contactPersonFirstName: data.contactPersonFirstName || savedData.contactPersonFirstName || "",
    contactPersonMiddleName: data.contactPersonMiddleName || savedData.contactPersonMiddleName || "",
    contactPersonLastName: data.contactPersonLastName || savedData.contactPersonLastName || "",
    smsVerificationLanguage: data.smsVerificationLanguage || savedData.smsVerificationLanguage || "English",
    verificationMethod: data.verificationMethod || savedData.verificationMethod || "SMS",
    businessIndustry: data.businessIndustry || savedData.businessIndustry || "",
    yearsInOperation: data.yearsInOperation || savedData.yearsInOperation || 0,
    businessWebsite: data.businessWebsite || savedData.businessWebsite || "",
    altPhoneNumber: data.altPhoneNumber || savedData.altPhoneNumber || "",
  });

  const dispatch = useDispatch();

  useEffect(() => {
    if (data) {
      setFormData((prev) => ({ ...prev, ...data }));
    }
  }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const updatedData = {
      ...formData,
      [e.target.name]: e.target.value,
    };
    setFormData(updatedData);
    onUpdate(updatedData);
    dispatch(updateRegistrationData({ [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const requiredFields = ["businessLocation", "businessName"];
    const missingFields = requiredFields.filter((field) => !formData[field as keyof typeof formData]);

    if (missingFields.length > 0) {
      alert(`Please fill in the required fields: ${missingFields.join(", ")}`);
      return;
    }

    console.log("CombinedInformationForm submitted:", formData);
    onSubmit();
    onNext();
  };

  return (
    <CombinedFormWrapper>
      <form onSubmit={handleSubmit}>
        <FormTitle>Business Information</FormTitle>

        <FormGroup>
          <label htmlFor="businessLocation">Business Location</label>
          <select
            id="businessLocation"
            name="businessLocation"
            value={formData.businessLocation}
            onChange={handleChange}
            required
          >
            <option value="">Select Country</option>
            <option value="US">United States</option>
            <option value="UK">United Kingdom</option>
            <option value="CA">Canada</option>
            <option value="AU">Australia</option>
          </select>
        </FormGroup>

        <FormGroup>
          <label>Business Type</label>
          <select name="businessType" value={formData.businessType} onChange={handleChange}>
            <option value="">Select Business Type</option>
            <option value="privately_owned">Privately-owned business</option>
            <option value="public_company">Public company</option>
            <option value="non_profit">Non-profit organization</option>
          </select>
        </FormGroup>

        <FormGroup>
          <label>Business Name</label>
          <input
            type="text"
            name="businessName"
            placeholder="Business Name"
            value={formData.businessName}
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup>
          <label>Business Industry</label>
          <select name="businessIndustry" value={formData.businessIndustry} onChange={handleChange}>
            <option value="">Select Industry</option>
            <option value="retail">Retail</option>
            <option value="technology">Technology</option>
            <option value="healthcare">Healthcare</option>
            <option value="manufacturing">Manufacturing</option>
          </select>
        </FormGroup>

        <FormGroup>
          <label>Years in Operation</label>
          <input
            type="number"
            name="yearsInOperation"
            value={formData.yearsInOperation}
            onChange={handleChange}
            placeholder="Years in Operation"
          />
        </FormGroup>

        <FormGroup>
          <label>Business Website (Optional)</label>
          <input
            type="url"
            name="businessWebsite"
            value={formData.businessWebsite}
            onChange={handleChange}
            placeholder="Enter Business Website"
          />
        </FormGroup>

        <FormGroup>
          <label>Alternative Contact Number (Optional)</label>
          <input
            type="text"
            name="altPhoneNumber"
            value={formData.altPhoneNumber}
            onChange={handleChange}
            placeholder="Enter Alternative Contact Number"
          />
        </FormGroup>

        <FormTitle>Company Information</FormTitle>

        <FormGroup>
          <label>Company Name</label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            placeholder="Enter Company Name"
          />
        </FormGroup>

        <FormGroup>
          <label>Company Registration Number</label>
          <input
            type="text"
            name="companyRegistrationNumber"
            value={formData.companyRegistrationNumber}
            onChange={handleChange}
            placeholder="Enter Company Registration Number"
          />
        </FormGroup>

        <SubmitButton type="submit">Submit</SubmitButton>
      </form>
    </CombinedFormWrapper>
  );
};

export default CombinedInformationForm;
