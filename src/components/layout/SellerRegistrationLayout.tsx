// src/layouts/SellerRegistrationLayout.tsx
import React from "react";
import Header from "../../components/header/Header"; // Adjust paths as needed
import Footer from "../../components/footer/Footer";
import LinearProgress from "../../components/progressbar/LinearProgress"; // Import the progress bar component
import StyledSellerRegistrationLayout from "./SellerRegistrationLayoutStyle";

interface SellerRegistrationLayoutProps {
  children: React.ReactNode;
  currentStep?: string; // Optional prop to show the current step
}

const steps = [
  "Create Account",
  "Verify Seller",
  "Select Seller Type",
  "Shop Setup",
  "Combined Information",
  "Billing Information",
  "Identity Verification",
  "Bank Account Verification",
  "Business Documentation",
  "Review and Submit",
  "Acknowledgment",
];

const SellerRegistrationLayout: React.FC<SellerRegistrationLayoutProps> = ({ children, currentStep }) => {
  // Calculate progress based on the current step
  const currentStepIndex = currentStep ? steps.findIndex((step) => step === currentStep) : -1;
  const progressPercentage =
    currentStepIndex >= 0 ? ((currentStepIndex + 1) / steps.length) * 100 : 0;

  return (
    <StyledSellerRegistrationLayout>
      {/* Header */}
      <Header />

      {/* Progress Indicator */}
      {currentStep && (
        <div className="progress-indicator-wrapper">
            <LinearProgress
              value={progressPercentage} // Pass dynamic progress
              color="dynamic" // Enable dynamic coloring
              thickness={8} // Slightly thicker bar
              label={`Step: ${currentStep}`} // Show current step as the label
              showValue={false} // Hide the percentage inside the bar
            />


        </div>
      )}

      {/* Main content area */}
      <main className="registration-content">
        <div className="form-wrapper">{children}</div>
      </main>

      {/* Footer */}
      <Footer />
    </StyledSellerRegistrationLayout>
  );
};

export default SellerRegistrationLayout;
