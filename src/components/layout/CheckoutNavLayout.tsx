import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Container from "../Container";
import Box from "../Box";
import Grid from "../grid/Grid";
import Navbar from "../navbar/Navbar";
import Stepper from "../stepper/Stepper";
import LinearProgress from "../progressbar/LinearProgress";
import AppLayout from "./AppLayout";

// Base Step type for Stepper
interface BaseStep {
  title: string;
  disabled: boolean;
}

// Extended Step type for CheckoutNavLayout
interface Step extends BaseStep {
  path: string; // Specific to CheckoutNavLayout
}

interface CheckoutNavLayoutProps {
  children: React.ReactNode; // Explicitly type 'children'
}

const CheckoutNavLayout: React.FC<CheckoutNavLayoutProps> = ({ children }) => {
  const [selectedStep, setSelectedStep] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;

  // Define the Stepper list with paths
  const stepperList: Step[] = [
    { title: "Cart", disabled: false, path: "/cart" },
    { title: "Details", disabled: false, path: "/checkout" },
    { title: "Payment", disabled: false, path: "/payment" },
    { title: "Review", disabled: true, path: "/orders" },
  ];

  // Update selected step based on the current pathname
  useEffect(() => {
    const stepIndex = stepperList.findIndex((step) => step.path === pathname);
    setSelectedStep(stepIndex >= 0 ? stepIndex : 0);
  }, [pathname, stepperList]);

  // Handle navigation when a step is clicked
  const handleStepChange = (step: BaseStep, index: number) => {
    const targetStep = stepperList[index];
    if (!targetStep.disabled) navigate(targetStep.path);
  };

  // Calculate progress percentage based on selected step
  const progressPercentage = ((selectedStep + 1) / stepperList.length) * 100;

  return (
    <AppLayout navbar={<Navbar />}>
      <Container my="2rem">
        {/* Progress Indicator */}
        <Box mb="2rem">
          <LinearProgress
            value={progressPercentage} // Dynamic progress percentage
            label={`Step ${selectedStep + 1} of ${stepperList.length}`}
            color="primary"
            thickness={8}
          />
        </Box>

        {/* Stepper Component */}
        <Box mb="2rem">
          <Grid container spacing={6}>
            <Grid item lg={8} md={8} xs={12}>
              <Stepper
                stepperList={stepperList.map(({ title, disabled }) => ({
                  title,
                  disabled,
                }))}
                selectedStep={selectedStep}
                onChange={handleStepChange} // Handle step changes
              />
            </Grid>
          </Grid>
        </Box>

        {/* Content Area */}
        {children}
      </Container>
    </AppLayout>
  );
};

export default CheckoutNavLayout;
