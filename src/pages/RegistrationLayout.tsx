import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SignInForm from '../components/Registration/SignInForm';
import CreateAccount from '../components/Registration/CreateAccount';
import EmailVerification from '../components/Registration/EmailVerification1';
import RequestOTPForm from '../components/Registration/RequestOTPForm';
import VerifyOTPForm from '../components/Registration/VerifyOTPForm';
import Signout from '../components/Registration/Signout';

const RegistrationLayout: React.FC = () => (
    <div>
        <Routes>
            
            <Route path="sign-in" element={<SignInForm />} />
            <Route path="create-account" element={<CreateAccount />} />
            <Route path="email-verification" element={<EmailVerification />} />
            {/* <Route path="request-otp" element={<RequestOTPForm />} /> */}
            <Route path="verify-otp" element={<VerifyOTPForm />} />
            <Route path="sign-out" element={<Signout />} />
        </Routes>
    </div>
);

export default RegistrationLayout;
