import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    setSellerVerificationCode,
    setVerificationStatus,
    setVerificationError,
    selectSellerVerification,
    SellerVerification
} from '../../../redux/slices/registrationSlice';
import axios from 'axios';

interface SellerVerificationFormProps {
    data: SellerVerification;
    onUpdate: (updatedData: Partial<SellerVerification>) => void;
    onNext: () => void; 
}

const SellerVerificationForm: React.FC<SellerVerificationFormProps> = ({ data, onUpdate }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { email, verificationError, verificationCode } = useSelector(selectSellerVerification);

    // Log Redux state on component load
    console.log('Redux Verification Data:', { email, verificationError, verificationCode });
    console.log('Email before verification:', email); // Add this log to check email



    const verifyCodeWithServer = async (code: string) => {
        try {
            const response = await axios.post('http://localhost:8000/auth/verify-code', {
                email,
                code,
            });
            return response.data.isValid; // Assuming the response has an `isValid` field
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Network Error Details:', error.toJSON()); // Log detailed error info
            } else {
                console.error('Unexpected Error:', error);
            }
            return false;
        }
    };
    


    const handleVerification = async (e: React.FormEvent) => {
        e.preventDefault();
    
        if (!email) {
            console.error("Email is missing from Redux state.");
            dispatch(setVerificationError("Email is missing. Please restart the registration process."));
            return;
        }
    
        const isValidCode = await verifyCodeWithServer(verificationCode);
        if (isValidCode) {
            dispatch(setVerificationStatus(true));
            dispatch(setVerificationError(null));
            navigate('/register/seller/type-selection');
        } else {
            dispatch(setVerificationError('Invalid verification code'));
        }
    };
    

    return (
        <div className="verification-form">
            <h2>Email Verification</h2>
            <p>A verification code has been sent to your email: {email}</p>
            <form onSubmit={handleVerification}>
                {verificationError && <p className="error">{verificationError}</p>}
                <label htmlFor="verificationCode">Verification Code</label>
                <input
                    type="text"
                    id="verificationCode"
                    placeholder="Enter the code"
                    value={verificationCode}
                    onChange={(e) => dispatch(setSellerVerificationCode(e.target.value))}
                    required
                />
                <button type="submit" className="submit-button">Verify</button>
            </form>
        </div>
    );
};

export default SellerVerificationForm;