import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { saveShopDetails, selectShopDetails } from '../../redux/slices/registrationSlice'; // import selectShopDetails
import { useNavigate } from 'react-router-dom';
import ProgressIndicator from './ProgressIndicator';  // Import the ProgressIndicator component
import './ShopSetupForm.css';

// Define the structure for ShopDetails (type ShopSetupFormData)
type ShopSetupFormData = {
  storeName: string;
  productCategories: string[];
  businessAddress: string;
  shippingDetails: string;
  returnPolicy: string;
};

// Define the props for ShopSetupForm component
interface ShopSetupFormProps {
  data: ShopSetupFormData; // Add this to correctly type the data prop
  onNext: () => void; // For proceeding to the next step
  onUpdate: (data: Partial<ShopSetupFormData>) => void; // Partial to allow updating only a subset of the data
}

const ShopSetupForm: React.FC<ShopSetupFormProps> = ({ onNext, onUpdate }) => {
  // Fetch saved shop details from the Redux store
  const savedShopDetails = useSelector(selectShopDetails);

  // Initialize form states with either saved data or default values
  const [formData, setFormData] = useState<ShopSetupFormData>({
    storeName: savedShopDetails?.storeName || '',
    productCategories: savedShopDetails?.productCategories || [],
    businessAddress: savedShopDetails?.businessAddress || '',
    shippingDetails: savedShopDetails?.shippingDetails || '',
    returnPolicy: savedShopDetails?.returnPolicy || ''
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCategories = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setFormData((prevData) => ({ ...prevData, productCategories: selectedCategories }));
    onUpdate({ productCategories: selectedCategories }); // Propagate the changes
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    onUpdate({ [name]: value }); // Propagate the changes
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Save the shop details in the Redux store
    dispatch(saveShopDetails(formData));

    // Navigate to the next step (Verification)
    onNext();
    navigate('/business/verification');
  };

  return (
    <form onSubmit={handleSubmit} className="shop-setup-form">
      <ProgressIndicator currentStep={4} /> {/* Show the current step */}
      <h1>Set Up Your Shop</h1>

      <div className="form-group">
        <label htmlFor="storeName">Store Name</label>
        <input
          id="storeName"
          name="storeName"
          type="text"
          value={formData.storeName}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="productCategories">Product Categories</label>
        <select
          id="productCategories"
          name="productCategories"
          multiple
          value={formData.productCategories}
          onChange={handleCategoryChange}
          required
        >
          <option value="Electronics">Electronics</option>
          <option value="Books">Books</option>
          <option value="Clothing">Clothing</option>
          <option value="Home & Kitchen">Home & Kitchen</option>
          <option value="Beauty">Beauty</option>
          {/* Add more categories as needed */}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="businessAddress">Business Address</label>
        <input
          id="businessAddress"
          name="businessAddress"
          type="text"
          value={formData.businessAddress}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="shippingDetails">Shipping Details</label>
        <textarea
          id="shippingDetails"
          name="shippingDetails"
          value={formData.shippingDetails}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="returnPolicy">Return Policy</label>
        <textarea
          id="returnPolicy"
          name="returnPolicy"
          value={formData.returnPolicy}
          onChange={handleInputChange}
          required
        />
      </div>

      <button type="submit" className="submit-button">Next</button>
    </form>
  );
};

export default ShopSetupForm;
