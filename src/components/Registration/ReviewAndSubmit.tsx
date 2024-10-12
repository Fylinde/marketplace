import React from 'react';
import { RegistrationState } from '../../redux/slices/registrationSlice';  // Assuming RegistrationState matches

interface ReviewAndSubmitProps {
  data?: RegistrationState | any;  // If it's not exactly RegistrationState, use a broader type like any
  onSubmit?: () => void;           // Used for individual sellers for final submission
  onNext?: () => void;             // Used for professional sellers to move to the next step
  status?: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string | null;
}

const ReviewAndSubmit: React.FC<ReviewAndSubmitProps> = ({ data, onSubmit, onNext, status, error }) => {

  const handleAction = () => {
    if (onSubmit) {
      onSubmit();  // Submit for individual sellers
    } else if (onNext) {
      onNext();   // Proceed to next step for professional sellers
    }
  };

  return (
    <div>
      <h1>Review Your Details</h1>

      {/* Conditionally render the registration data for review if available */}
      {data ? (
        <div>
          <h3>Your Registration Information:</h3>
          <pre>{JSON.stringify(data, null, 2)}</pre>  {/* Display combined data */}
        </div>
      ) : (
        <p>No data available for review.</p>
      )}

      {/* Button action: For professional sellers it says "Next", for individual sellers it says "Submit Registration" */}
      <button onClick={handleAction} disabled={status === 'loading'}>
        {status === 'loading' ? 'Processing...' : onSubmit ? 'Submit Registration' : 'Next'}
      </button>

      {/* Error and success status handling */}
      {status === 'failed' && <p className="error-message">Error: {error}</p>}
      {status === 'succeeded' && <p className="success-message">Action successful!</p>}
    </div>
  );
};

export default ReviewAndSubmit;
