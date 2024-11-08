// src/layouts/UserRegistrationLayout.tsx
import React from "react";
import Header from "components/header/Header"; // Adjust path if needed
import Footer from "components/footer/Footer"; // Adjust path if needed
import StyledUserRegistrationLayout from "./StyledUserRegistrationLayout";


interface UserRegistrationLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const UserRegistrationLayout: React.FC<UserRegistrationLayoutProps> = ({ children, title = "User Registration" }) => {
  return (
    <StyledUserRegistrationLayout>
      <Header />
      
      <main className="registration-content">
        <h2 className="title">{title}</h2>
        <div className="form-wrapper">{children}</div>
      </main>
      
      <Footer />
    </StyledUserRegistrationLayout>
  );
};

export default UserRegistrationLayout;
