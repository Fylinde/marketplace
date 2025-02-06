import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import { fetchCurrentStep, resetRegistrationState, setSellerId } from "../../redux/slices/auth/sellerRegistrationSlice";
import SellerRegistrationLayout from "components/layout/SellerRegistrationLayout";
import LinearProgress from "../progressbar/LinearProgress";

const ProfessionalSellerRegistrationRoutes: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch<AppDispatch>();
    
    const sellerId = useSelector((state: RootState) => state.sellerRegistration.sellerId);
    const step = useSelector((state: RootState) => state.sellerRegistration.step);
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        console.log("🔄 Checking current step...");

        // ✅ Ensure Redux is initialized properly before fetching
        if (!initialized) {
            console.log("🛠 Resetting registration state...");
            dispatch(resetRegistrationState()); // Reset to step 1
            setInitialized(true);
            return;
        }

        // ✅ Fetch step from backend if seller ID exists
        if (sellerId) {
            console.log(`📡 Fetching current step for seller ${sellerId}`);
            dispatch(fetchCurrentStep(sellerId));
        }

        // ✅ Redirect based on step
        if (step === 1 && location.pathname !== "/register/seller/professional/account") {
            navigate("/register/seller/professional/account");
        } else if (step === 2 && location.pathname !== "/register/seller/professional/verify") {
            navigate("/register/seller/professional/verify");
        }
    }, [step, navigate, location.pathname, dispatch, initialized, sellerId]);

    const progressValue = step === 1 ? 50 : step === 2 ? 100 : 0;

    return (
        <SellerRegistrationLayout>
            <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
                <LinearProgress 
                    variant="determinate" 
                    value={progressValue} 
                    color="dynamic"
                    label="Registration Progress"
                    showValue={true}
                />
                <Outlet />
            </div>
        </SellerRegistrationLayout>
    );
};

export default ProfessionalSellerRegistrationRoutes;
