import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  StyledContainer,
  Header,
  Logo,
  Nav,
  LanguageSelector,
  MainContent,
  IntroSection,
  StartButton,
  StepsSection,
  Step,
  StepIcon,
  StepContent,
  Footer,
  Links,
  
} from "./WelcomeScreenStyled";
const WelcomeScreen: React.FC = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/register/type-selection");
  };

  return (
    <StyledContainer>
      <MainContent>
        <IntroSection>
          <h1>Welcome to Fylinde Seller Central</h1>
          <p>
            Start your journey to becoming a successful seller on our platform.
            Join a global network of businesses and entrepreneurs!
          </p>
          <StartButton onClick={handleStart}>Get Started</StartButton>
        </IntroSection>
        <StepsSection>
          <h2>What to Expect:</h2>
          <Step>
            <StepIcon>📝</StepIcon>
            <StepContent>
              <h3>Step 1: Provide your information</h3>
              <p>
                Share your personal and business details to set up your seller
                account.
              </p>
            </StepContent>
          </Step>
          <Step>
            <StepIcon>✅</StepIcon>
            <StepContent>
              <h3>Step 2: Verification</h3>
              <p>
                Verify your identity to ensure your account complies with our
                policies.
              </p>
            </StepContent>
          </Step>
          <Step>
            <StepIcon>🚀</StepIcon>
            <StepContent>
              <h3>Step 3: Start Selling</h3>
              <p>
                Once verified, you're ready to list your products and start
                selling!
              </p>
            </StepContent>
          </Step>
        </StepsSection>
      </MainContent>

    </StyledContainer>
  );
};

export default WelcomeScreen;
