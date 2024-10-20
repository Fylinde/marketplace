import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setAuthData } from '../../redux/slices/authSlice';

const EmailVerification: React.FC = () => {
    const [code, setCode] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const apiUrl = process.env.REACT_APP_AUTH_SERVICE_URL || 'http://localhost:8000';


    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const verificationCode = queryParams.get('code');
        const accessToken = queryParams.get('access_token');
        const refreshToken = queryParams.get('refresh_token');
        
        console.log("Query Parameters:", location.search);
        console.log("Verification Code:", verificationCode);
        console.log("Access Token:", accessToken);
        console.log("Refresh Token:", refreshToken);

        if (accessToken && refreshToken) {
            // If tokens are found, store them and navigate to the dashboard
            localStorage.setItem('access_token', accessToken);
            localStorage.setItem('refresh_token', refreshToken);
            dispatch(setAuthData({ access_token: accessToken, refresh_token: refreshToken, user: null }));
            
            // Clean the URL and navigate to dashboard without query parameters
            navigate('/user-dashboard', { replace: true });
        } else if (verificationCode) {
            // If only the verification code is present, trigger verification
            setCode(verificationCode);
            verifyCode(verificationCode, true);
        }
    }, [location.search, dispatch, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        verifyCode(code, false);
    };

    const verifyCode = async (verificationCode: string, autoRedirect: boolean) => {
        try {
            // Include redirect=true in the request if autoRedirect is enabled
            const response = await fetch(`${apiUrl}/auth/verify?code=${verificationCode}&redirect=${autoRedirect}`);
            if (!response.ok) throw new Error('Verification failed');
            
            const data = await response.json();
            const { access_token, refresh_token, user } = data;

            // Store tokens and user data in localStorage
            localStorage.setItem('access_token', access_token);
            localStorage.setItem('refresh_token', refresh_token);
            localStorage.setItem('user', JSON.stringify(user));

            // Dispatch action to set authentication data in Redux
            dispatch(setAuthData({ access_token, refresh_token, user }));

            // Navigate to user dashboard
            navigate('/user-dashboard');
        } catch (error) {
            setError((error as Error).message);
        }
    };

    return (
        <div>
            <h2>Email Verification</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <label htmlFor="verificationCode">Enter Verification Code:</label>
                <input
                    type="text"
                    id="verificationCode"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    minLength={4}
                    maxLength={6}
                    required
                />
                <button type="submit">Verify</button>
            </form>
        </div>
    );
};

export default EmailVerification;
