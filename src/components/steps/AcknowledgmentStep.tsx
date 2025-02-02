import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  setCurrentStep,
  saveAcknowledgment,
} from '../../redux/slices/auth/registrationSlice';
import LinearProgress from '../progressbar/LinearProgress';
import Acknowledgment from '../Registration/CompanyForms/Acknowledgment';
import { RootState, AppDispatch } from '../../redux/store';

interface StepProps {
  registrationData: { consentGiven: boolean };
  updateStep: (step: string, data?: Record<string, any>) => void;
}

const steps = ['document_upload', 'acknowledgment', 'confirmation'];

const AcknowledgmentStep: React.FC<StepProps> = ({ registrationData, updateStep }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { currentStep } = useSelector((state: RootState) => state.registration);

  const [consentGiven, setConsentGiven] = useState(registrationData.consentGiven);

  // Set current step on mount
  useEffect(() => {
    dispatch(setCurrentStep('acknowledgment'));
  }, [dispatch]);

  // Update consent state and save to Redux
  const handleUpdateConsent = (updatedData: { consentGiven: boolean }) => {
    setConsentGiven(updatedData.consentGiven);
    dispatch(saveAcknowledgment(updatedData));
  };

  // Navigate to the next step
  const handleNext = () => {
    if (!consentGiven) {
      alert('Please acknowledge the terms and conditions before proceeding.');
      return;
    }
    updateStep('confirmation', { consentGiven });
    navigate('/register/seller/confirmation');
  };

  // Calculate progress percentage
  const progressPercentage = ((steps.indexOf(currentStep) + 1) / steps.length) * 100;

  return (
    <div>
      <h1>Acknowledgment</h1>
      {/* Progress Bar */}
      <LinearProgress
        value={progressPercentage}
        color="dynamic"
        thickness={10}
        label="Registration Progress"
        showValue
      />
      {/* Acknowledgment Form */}
      <Acknowledgment
        data={{ consentGiven }}
        onUpdate={handleUpdateConsent}
        onNext={handleNext}
      />
    </div>
  );
};

export default AcknowledgmentStep;
