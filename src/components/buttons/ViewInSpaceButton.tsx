import React from "react";
import Button from "../buttons/Button";

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
      alert("AR is not available for this product.");
      return;
    }
    if (productId) {
      console.log(`Opening AR view for product: ${productId}`);
      // Trigger AR view for a specific product (e.g., navigate to AR page or open modal)
    } else {
      console.log("Opening generic AR viewer");
      // Fallback logic for AR view when no productId is provided
    }
  };

  const handleClick = () => {
    if (!isArEnabled) return;

    if (productId) {
      console.log(`Opening AR viewer for product ID: ${productId}`);
      // Logic to handle AR viewing for a specific product
    } else {
      console.log("Opening generic AR viewer");
      // Fallback logic for generic AR viewing
    }
  };

  return (
    isArEnabled && (
      <Button
        style={{ marginTop: "10px", padding: "5px 10px" }}
        onClick={handleViewInSpace} // Using handleViewInSpace for the button click
      >
        View in Your Space
      </Button>
    )
  );
};

export default ViewInSpaceButton;
