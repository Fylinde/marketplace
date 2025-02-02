import React from "react";
import Button from "../buttons/Button";
import { getLocalizedText } from "../../utils/localizationUtils"; // Adjust the path as needed

interface ViewInSpaceButtonProps {
  productId?: string | number; // Optional to avoid breaking existing files
  isArEnabled: boolean;
}

const ViewInSpaceButton: React.FC<ViewInSpaceButtonProps> = ({
  productId,
  isArEnabled,
}) => {
  const handleViewInSpace = () => {
    if (!isArEnabled) {
      alert(getLocalizedText("arNotAvailable", "general")); // Translatable AR availability message
      return;
    }
    if (productId) {
      console.log(`Opening AR view for product: ${productId}`);
      // Trigger AR view for a specific product
    } else {
      console.log("Opening generic AR viewer");
      // Fallback logic for generic AR view
    }
  };

  if (!isArEnabled) return null; // Return null if AR is disabled

  return (
    <Button
      style={{ marginTop: "10px", padding: "5px 10px" }}
      onClick={handleViewInSpace}
    >
      {getLocalizedText("viewInYourSpace", "general")} {/* Translatable button label */}
    </Button>
  );
};

export default ViewInSpaceButton;
