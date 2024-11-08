// src/layouts/AccountRegistrationLayout.tsx
import React from "react";
import Header from "components/header/Header"; // Adjust paths if needed
import Footer from "components/footer/Footer";
import StyledAccountRegistrationLayout from "./AccountRegistrationLayoutStyle";

interface AccountRegistrationLayoutProps {
  children: React.ReactNode;
}

const AccountRegistrationLayout: React.FC<AccountRegistrationLayoutProps> = ({ children }) => {
  return (
    <StyledAccountRegistrationLayout>
      {/* Header */}
      <Header />

      {/* Main content area */}
      <main className="registration-content">
        <div className="registration-wrapper">{children}</div>
      </main>

      {/* Footer */}
      <Footer />
    </StyledAccountRegistrationLayout>
  );
};

export default AccountRegistrationLayout;
