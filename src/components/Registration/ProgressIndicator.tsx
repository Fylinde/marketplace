import React from 'react';
import './ProgressIndicator.css';

interface ProgressIndicatorProps {
  currentStep: number;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ currentStep }) => {
  const steps = ['Seller Information', 'Billing', 'Shop', 'Verification'];

  return (
    <div className="progress-indicator">
      {steps.map((step, index) => (
        <div key={index} className={`step ${currentStep === index + 1 ? 'active' : ''}`}>
          <div className="circle">{index + 1}</div>
          <span>{step}</span>
        </div>
      ))}
    </div>
  );
};

export default ProgressIndicator;
