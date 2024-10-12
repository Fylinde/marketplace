import React from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { submitRegistration, selectPaymentDetails } from '../../redux/slices/registrationSlice';  // Added selectPaymentDetails
import CompanyDetailsForm from './CompanyDetailsForm';
import ContactDetailsForm from './ContactDetailsForm';
import PaymentDetailsForm from './PaymentDetailsForm';
import DocumentUploadForm from './DocumentUploadForm';
import ReviewAndSubmit from './ReviewAndSubmit';

const BusinessRegistrationForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // The registrationData is used only for displaying in the ReviewAndSubmit component, not for the submission
  const registrationData = useSelector((state: RootState) => state.registration);
  const status = useSelector((state: RootState) => state.registration.registrationStatus);
  const error = useSelector((state: RootState) => state.registration.error);

  // Select saved payment details from Redux
  const savedPaymentDetails = useSelector(selectPaymentDetails);

  const handleSubmit = () => {
    dispatch(submitRegistration());  // No argument is passed here
  };

  return (
    <Routes>
      <Route path="/" element={<CompanyDetailsForm onNext={() => navigate('contact-details')} />} />
      <Route path="contact-details" element={<ContactDetailsForm onNext={() => navigate('payment-details')} />} />
      
      {/* Update to pass the necessary props to PaymentDetailsForm */}
      <Route 
        path="payment-details" 
        element={
          <PaymentDetailsForm 
            data={savedPaymentDetails || {}}  // Pass saved data or an empty object
            onUpdate={(updatedData) => {
              // Handle the updated data from the PaymentDetailsForm
              console.log('Updated payment data:', updatedData);
            }}
            onNext={() => navigate('document-upload')}  // Navigate without passing values
          />
        } 
      />
      
      <Route path="document-upload" element={<DocumentUploadForm onNext={() => navigate('review')} />} />
      <Route path="review" element={
        <ReviewAndSubmit 
          data={registrationData} 
          onSubmit={handleSubmit} 
          status={status} 
          error={error} 
        />
      } />
    </Routes>
  );
};

export default BusinessRegistrationForm;
