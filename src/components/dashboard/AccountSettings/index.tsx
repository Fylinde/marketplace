import React, { useState, useEffect } from "react";
import PersonalInfo from "./PersonalInfo";
import BusinessInfo from "./BusinessInfo";
import BankDetails from "./BankDetails";
import Addresses from "./Addresses";
import BusinessHours from "./BusinessHours";
import ImageManagement from "./ImageManagement";

interface AccountData {
  personalInfo: any; // Replace with the actual type of personalInfo
  businessInfo: any; // Replace with the actual type of businessInfo
  bankDetails: any; // Replace with the actual type of bankDetails
  imageManagement: any;
  addresses: any;
  businessHours: any;
}

const AccountSettings: React.FC = () => {
  const [data, setData] = useState<AccountData | null>(null);

  useEffect(() => {
    // Fetch initial data from API
    fetch("/api/seller")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleUpdate = <T,>(section: keyof AccountData, updatedData: T) => {
    setData((prev) => (prev ? { ...prev, [section]: updatedData } : prev));
  };

  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <h1>Account Settings</h1>
      {/* Personal Info Section */}
      <PersonalInfo
        data={data.personalInfo}
        onUpdate={(updatedData) => handleUpdate("personalInfo", updatedData)}
      />

      {/* Business Info Section */}
      <BusinessInfo
        data={data.businessInfo}
        onUpdate={(updatedData) => handleUpdate("businessInfo", updatedData)}
      />

      {/* Business Hours Section */}
      <BusinessHours
        data={data.businessInfo}
        onUpdate={(updatedData) => handleUpdate("businessInfo", updatedData)}
      />

      {/* Image Management Section */}
      <ImageManagement
        data={data.businessInfo}
        onUpdate={(updatedData) => handleUpdate("businessInfo", updatedData)}
      />

      {/* Addresses Section */}
      <Addresses
        data={data.businessInfo}
        onUpdate={(updatedData) => handleUpdate("businessInfo", updatedData)}
      />

      {/* Bank Details Section */}
      <BankDetails
        data={data.bankDetails}
        onAdd={() => console.log("Add Bank")}
        onDelete={(index) => console.log("Delete Bank", index)}
        onEdit={(index) => console.log("Edit Bank", index)}
      />
    </div>
  );
};

export default AccountSettings;
