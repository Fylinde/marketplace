import React, { useEffect, useState } from "react";
import {
  CombinedFormContainer,
  StyledInput,
  StyledSelect,
  StyledTextArea,
  StyledButton,
  ErrorMessage,
} from "./CombinedShopAndStoreFormStyle";
import Select, { MultiValue } from "react-select";


interface CombinedFormProps {
  data: {
    storeName: string;
    productCategories: string[];
    businessAddress: string;
    shippingDetails: string;
    returnPolicy: string;
    upc: string;
    manufacturerBrandOwner: string;
    trademarkOwnership: string;
  };
  onUpdate: (updatedData: Partial<CombinedFormProps["data"]>) => void;
  onNext: () => void;
}

const CombinedShopAndStoreForm: React.FC<CombinedFormProps> = ({ data, onUpdate, onNext }) => {
  const [formData, setFormData] = useState(data);
  const [errors, setErrors] = useState<{
    storeName: string;
    productCategories: string;
    businessAddress: string;
    shippingDetails: string;
    returnPolicy: string;
    upc: string;
    manufacturerBrandOwner: string;
    trademarkOwnership: string;
  }>({
    storeName: "",
    productCategories: "",
    businessAddress: "",
    shippingDetails: "",
    returnPolicy: "",
    upc: "",
    manufacturerBrandOwner: "",
    trademarkOwnership: "",
  });

  const categoryOptions = [
    { value: "Electronics", label: "Electronics" },
    { value: "Books", label: "Books" },
    { value: "Clothing", label: "Clothing" },
    { value: "Home & Kitchen", label: "Home & Kitchen" },
    { value: "Beauty", label: "Beauty" },
  ];

  useEffect(() => {
    setFormData(data);
  }, [data]);

  const validateField = (field: keyof typeof formData, value: string | string[]) => {
    if (!value || (Array.isArray(value) && value.length === 0)) {
      return `${field} is required.`;
    }
    return "";
  };

  const handleInputChange = (field: keyof typeof formData, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: validateField(field, value),
    }));
    onUpdate({ [field]: value });
  };

  const handleCategoryChange = (selectedOptions: MultiValue<{ value: string; label: string }>) => {
    const selectedCategories = selectedOptions.map((option) => option.value);
    handleInputChange("productCategories", selectedCategories);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = (Object.keys(formData) as Array<keyof typeof formData>).reduce((acc, field) => {
      const errorMessage = validateField(field, formData[field]);
      acc[field] = errorMessage;
      return acc;
    }, {} as Record<keyof typeof formData, string>);

    if (Object.values(newErrors).every((error) => !error)) {
      onNext();
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <CombinedFormContainer>
      <h1>Shop and Store Setup</h1>
      <form onSubmit={handleSubmit}>
        {/* Store Name */}
        <label>Store Name</label>
        <StyledInput
          type="text"
          value={formData.storeName}
          onChange={(e) => handleInputChange("storeName", e.target.value)}
          placeholder="Enter your store name"
        />
        {errors.storeName && <ErrorMessage>{errors.storeName}</ErrorMessage>}

        {/* Product Categories */}
        <label>Product Categories</label>
        <Select
          isMulti
          options={categoryOptions}
          value={categoryOptions.filter((option) => formData.productCategories.includes(option.value))}
          onChange={handleCategoryChange}
          placeholder="Select product categories"
        />
        {errors.productCategories && <ErrorMessage>{errors.productCategories}</ErrorMessage>}

        {/* Business Address */}
        <label>Business Address</label>
        <StyledInput
          type="text"
          value={formData.businessAddress}
          onChange={(e) => handleInputChange("businessAddress", e.target.value)}
          placeholder="Enter your business address"
        />
        {errors.businessAddress && <ErrorMessage>{errors.businessAddress}</ErrorMessage>}

        {/* Shipping Details */}
        <label>Shipping Details</label>
        <StyledTextArea
          value={formData.shippingDetails}
          onChange={(e) => handleInputChange("shippingDetails", e.target.value)}
          placeholder="Enter your shipping details"
        />
        {errors.shippingDetails && <ErrorMessage>{errors.shippingDetails}</ErrorMessage>}

        {/* Return Policy */}
        <label>Return Policy</label>
        <StyledTextArea
          value={formData.returnPolicy}
          onChange={(e) => handleInputChange("returnPolicy", e.target.value)}
          placeholder="Enter your return policy"
        />
        {errors.returnPolicy && <ErrorMessage>{errors.returnPolicy}</ErrorMessage>}

        {/* UPC */}
        <label>Do you have Universal Product Codes (UPCs) for all your products?</label>
        <StyledSelect
          value={formData.upc}
          onChange={(e) => handleInputChange("upc", e.target.value)}
        >
          <option value="">Select an option</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </StyledSelect>
        {errors.upc && <ErrorMessage>{errors.upc}</ErrorMessage>}

        {/* Manufacturer or Brand Owner */}
        <label>Are you the manufacturer or brand owner for your products?</label>
        <StyledSelect
          value={formData.manufacturerBrandOwner}
          onChange={(e) => handleInputChange("manufacturerBrandOwner", e.target.value)}
        >
          <option value="">Select an option</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
          <option value="some">Some</option>
        </StyledSelect>
        {errors.manufacturerBrandOwner && (
          <ErrorMessage>{errors.manufacturerBrandOwner}</ErrorMessage>
        )}

        {/* Trademark Ownership */}
        <label>Do you own trademarks for your branded products?</label>
        <StyledSelect
          value={formData.trademarkOwnership}
          onChange={(e) => handleInputChange("trademarkOwnership", e.target.value)}
        >
          <option value="">Select an option</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
          <option value="some">Some</option>
        </StyledSelect>
        {errors.trademarkOwnership && <ErrorMessage>{errors.trademarkOwnership}</ErrorMessage>}

        {/* Submit Button */}
        <StyledButton type="submit">Next</StyledButton>
      </form>
    </CombinedFormContainer>
  );
};

export default CombinedShopAndStoreForm;
