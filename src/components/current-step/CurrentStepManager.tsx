import React, { useEffect, useState } from "react";
import axios from "axios";

// Define the types
interface RegistrationStep {
  step: string;
  registration_data?: Record<string, any>;
}

interface CurrentStepManagerProps {
  sellerId: number;
  steps: Record<string, React.ReactNode>; // Maps step names to components
}

const CurrentStepManager: React.FC<CurrentStepManagerProps> = ({ sellerId, steps }) => {
  const [currentStep, setCurrentStep] = useState<string | null>(null);
  const [registrationData, setRegistrationData] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch the current step when the component mounts
  useEffect(() => {
    const fetchCurrentStep = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/sellers/${sellerId}/current-step`);
        setCurrentStep(response.data.current_step);
        setRegistrationData(response.data.registration_data || {});
      } catch (error) {
        console.error("Error fetching current step:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentStep();
  }, [sellerId]);

  // Handle updating the step
  const updateStep = async (step: string, data?: Record<string, any>) => {
    try {
      const response = await axios.put(`/sellers/${sellerId}/current-step`, {
        seller_id: sellerId,
        step,
        registration_data: data,
      });
      setCurrentStep(response.data.current_step);
      setRegistrationData(response.data.registration_data);
    } catch (error) {
      console.error("Error updating step:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!currentStep) {
    return <div>Error: Unable to fetch registration progress.</div>;
  }

  const CurrentStepComponent = steps[currentStep];

  return (
    <div>
      {CurrentStepComponent ? (
        React.cloneElement(CurrentStepComponent as React.ReactElement, {
          registrationData,
          updateStep,
        })
      ) : (
        <div>Unknown step: {currentStep}</div>
      )}
    </div>
  );
};

export default CurrentStepManager;
