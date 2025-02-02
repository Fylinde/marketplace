import React from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";

import ShippingManagement from "./ShippingManagement";
import ShippingSettings from "./ShippingSettings";
import WarehouseManager from "./WarehouseManager";

import { RootState, AppDispatch } from "../../../redux/store"; // Adjust the path to your Redux store
import { fetchShippingData, updateShippingSettings } from "../../../redux/slices/logistics/shippingSlice";
import { getLocalizedText } from "../../../utils/localizationUtils";

const ShippingContainer = styled.div`
  padding: 20px;

  h1 {
    font-size: 2rem;
    margin-bottom: 20px;
  }

  .section {
    margin-bottom: 20px;
  }
`;

const Shipping: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { shippingData, loading, error } = useSelector((state: RootState) => state.shipping);

  React.useEffect(() => {
    dispatch(fetchShippingData({ country: "US", currency: "USD" })); // Provide required arguments
  }, [dispatch]);

  const handleSettingsUpdate = async (newSettings: any) => {
    try {
      await dispatch(updateShippingSettings(newSettings)).unwrap();
      alert(getLocalizedText("Settings updated successfully!", "shipping"));
    } catch (err) {
      alert(getLocalizedText("Failed to update settings.", "shipping"));
    }
  };

  return (
    <ShippingContainer>
      <h1>{getLocalizedText("Shipping Management", "shipping")}</h1>

      <div className="section">
        <ShippingManagement shippingData={shippingData} loading={loading} error={error} />
      </div>

      <div className="section">
        <ShippingSettings onUpdate={handleSettingsUpdate} />
      </div>

      <div className="section">
        <WarehouseManager />
      </div>
    </ShippingContainer>
  );
};

export default Shipping;
