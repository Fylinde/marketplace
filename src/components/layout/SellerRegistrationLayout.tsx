// src/layouts/SellerRegistrationLayout.tsx
import React from "react";
import Header from "components/header/Header"; // Adjust paths as needed
import Footer from "components/footer/Footer";
import StyledSellerRegistrationLayout from "./SellerRegistrationLayoutStyle";

interface SellerRegistrationLayoutProps {
  children: React.ReactNode;
  currentStep?: string; // Optional prop to show the current step, if needed
}

const SellerRegistrationLayout: React.FC<SellerRegistrationLayoutProps> = ({ children, currentStep }) => {
  return (
    <StyledSellerRegistrationLayout>
      {/* Header */}
      <Header />

      {/* Progress Indicator (optional) */}
      {currentStep && (        
        <div className="progress-indicator">
        <i className="fa fa-arrow-right" style={{ marginRight: '0.5rem' }}></i>
         Step: {currentStep}
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
