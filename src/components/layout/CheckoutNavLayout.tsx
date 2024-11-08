import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; 
import Container from "../Container";
import Box from "../Box";
import Grid from "../grid/Grid";
import Navbar from "../navbar/Navbar";
import Stepper from "../stepper/Stepper";
import AppLayout from "./AppLayout";

// Define Step type (replace this with the actual structure of Step in your code)
interface Step {
  title: string;
  disabled: boolean;
}

interface CheckoutNavLayoutProps {
  children: React.ReactNode; // Explicitly type 'children'
}

const CheckoutNavLayout: React.FC<CheckoutNavLayoutProps> = ({ children }) => {
  const [selectedStep, setSelectedStep] = useState(0);

  const navigate = useNavigate(); 
  const location = useLocation(); 
  const { pathname } = location;

  // Type '_step' as 'Step'
  const handleStepChange = (step: Step, ind: number) => {
    switch (ind) {
      case 0:
        navigate("/cart");
        break;
      case 1:
        navigate("/checkout");
        break;
      case 2:
        navigate("/payment");
        break;
      case 3:
        navigate("/orders");
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    switch (pathname) {
      case "/cart":
        setSelectedStep(1);
        break;
      case "/checkout":
        setSelectedStep(2);
        break;
      case "/payment":
        setSelectedStep(3);
        break;
      default:
        break;
    }
  }, [pathname]);

  return (
    <AppLayout navbar={<Navbar />}>
      <Container my="2rem">
        <Box mb="14px">
          <Grid container spacing={6}>
            <Grid item lg={8} md={8} xs={12}>
              <Stepper
                stepperList={stepperList}
                selectedStep={selectedStep}
                onChange={handleStepChange}  
              />
            </Grid>
          </Grid>
        </Box>
        {children}
      </Container>
    </AppLayout>
  );
};

// Define the Stepper list
const stepperList: Step[] = [
  {
    title: "Cart",
    disabled: false,
  },
  {
    title: "Details",
    disabled: false,
  },
  {
    title: "Payment",
    disabled: false,
  },
  {
    title: "Review",
    disabled: true,
  },
];

export default CheckoutNavLayout;
