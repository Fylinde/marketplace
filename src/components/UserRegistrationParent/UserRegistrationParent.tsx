// src/pages/UserRegistrationParent.tsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import UserRegistrationLayout from "components/layout/UserRegistrationLayout";
import SignInForm from "components/Registration/SignInForm";
import CreateAccount from "components/Registration/CreateAccount";
import EmailVerification from "components/Registration/EmailVerification";
import RequestOTPForm from "components/Registration/RequestOTPForm";
import VerifyOTPForm from "components/Registration/VerifyOTPForm";
import Signout from "components/Registration/Signout";
import CreateSellerAccount from "components/Registration/CreateSellerAccount";



const UserRegistrationParent: React.FC = () => {
 
  const handleNext = () => {
    // Define the behavior for the 'next' step
    console.log("Next step triggered");
};

  return (
    <Routes>
      <Route
        path="sign-in"
        element={
          <UserRegistrationLayout title="Sign In">
            <SignInForm />
          </UserRegistrationLayout>
        }
      />
      <Route
        path="create-account"
        element={
          <UserRegistrationLayout title="Create Account">
            <CreateAccount />
          </UserRegistrationLayout>
        }
      />
      <Route
        path="email-verification"
        element={
          <UserRegistrationLayout title="Email Verification">
            <EmailVerification />
          </UserRegistrationLayout>
        }
      />
      <Route
        path="request-otp"
        element={
          <UserRegistrationLayout title="Request OTP">
            <RequestOTPForm />
          </UserRegistrationLayout>
        }
      />
      <Route
        path="verify-otp"
        element={
          <UserRegistrationLayout title="Verify OTP">
            <VerifyOTPForm />
          </UserRegistrationLayout>
        }
      />
      <Route
        path="sign-out"
        element={
          <UserRegistrationLayout title="Sign Out">
            <Signout />
          </UserRegistrationLayout>
        }
      />
      <Route
        path="create-seller-account"
        element={
          <UserRegistrationLayout title="Create Seller">
            <CreateSellerAccount onNext={handleNext} />
          </UserRegistrationLayout>
        }
      />

    </Routes>

  );
};

export default UserRegistrationParent;
