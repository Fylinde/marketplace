import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  setCurrentStep,
  saveDocumentUploads,
} from '../../redux/slices/auth/registrationSlice';
import LinearProgress from '../progressbar/LinearProgress';
import DocumentUploadManager from '../Registration/CompanyForms/DocumentUploadManager';
import DocumentUpload from '../Registration/CompanyForms/DocumentUpload';
import { RootState, AppDispatch } from '../../redux/store';

interface DocumentUploadType {
  file: File | null;
  fileName: string;
  uploadStatus: 'idle' | 'uploading' | 'succeeded' | 'failed';
  uploadError: string | null;
}

const steps = ['create_account', 'document_upload', 'review_and_submit'];

const DocumentUploadManagerStep: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { currentStep, documentDetails } = useSelector((state: RootState) => state.registration);

  const documentUploads: DocumentUploadType[] = documentDetails.documents.map((doc: any) => ({
    file: doc.file || null,
    fileName: doc.fileName || '',
    uploadStatus: doc.uploadStatus || 'idle',
    uploadError: doc.uploadError || null,
  }));

  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'succeeded' | 'failed'>('idle');

  useEffect(() => {
    dispatch(setCurrentStep('document_upload'));
  }, [dispatch]);

  const handleAddDocument = (newDocument: DocumentUploadType) => {
    const updatedUploads = [...documentUploads, newDocument];
    dispatch(saveDocumentUploads(updatedUploads));
  };

  const handleRemoveDocument = (fileName: string) => {
    const updatedUploads = documentUploads.filter((doc) => doc.fileName !== fileName);
    dispatch(saveDocumentUploads(updatedUploads));
  };

  const handleResetDocuments = () => {
    dispatch(saveDocumentUploads([]));
  };

  const handleNextStep = () => {
    if (documentUploads.some((doc) => doc.uploadStatus === 'idle')) {
      setUploadError('Please complete all document uploads before proceeding.');
      return;
    }
    navigate('/register/seller/review-and-submit');
  };

  const progressPercentage = ((steps.indexOf(currentStep) + 1) / steps.length) * 100;

  return (
    <div>
      <h1>Document Upload</h1>
      <LinearProgress
        value={progressPercentage}
        color="dynamic"
        thickness={10}
        label="Registration Progress"
        showValue
      />
      <DocumentUpload
        label="Upload Document"
        onFileChange={(file: File) => {
          const newDocument: DocumentUploadType = {
            file,
            fileName: file.name,
            uploadStatus: 'idle',
            uploadError: null,
          };
          handleAddDocument(newDocument);
        }}
      />
      <DocumentUploadManager
        data={documentUploads}
        status={uploadStatus}
        error={uploadError}
        onAddDocument={handleAddDocument}
        onRemoveDocument={handleRemoveDocument}
        onReset={handleResetDocuments}
        onNext={handleNextStep}
      />
    </div>
  );
};

export default DocumentUploadManagerStep;
