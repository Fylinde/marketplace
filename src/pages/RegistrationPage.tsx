import React from 'react';
import { Route, Routes } from 'react-router-dom';
import WelcomeScreen from '../components/Registration/WelcomeScreen';
import ParentComponent from '../components/ParentComponent/ParentComponent'; // Centralized form management for sellers
import SignInForm from '../components/Registration/SignInForm';
import RequestOTPForm from '../components/Registration/RequestOTPForm';
import VerifyOTPForm from '../components/Registration/VerifyOTPForm';
import CreateAccount from '../components/Registration/CreateAccount';
import EmailVerification from '../components/Registration/EmailVerification';
import UserDashboard from '../components/UserDashboard/UserDashboard'; // User dashboard after registration

const RegistrationPage: React.FC = () => {
  return (
    <div className="registration-page">
      <Routes>
        {/* Ordinary User Registration */}
        <Route path="/sign-in" element={<SignInForm />} />
        <Route path="/request-otp" element={<RequestOTPForm />} />
        <Route path="/2fa-verification" element={<VerifyOTPForm />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/email-verification" element={<EmailVerification />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />

        {/* Centralized Seller Registration - Individual and Professional */}
        <Route path="/seller-registration/*" element={<ParentComponent />} />
      </Routes>
    </div>
  );
};

export default RegistrationPage;
