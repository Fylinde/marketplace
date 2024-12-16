import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { fetchCertifications } from "../../../redux/slices/security/certificationSlice";
import { getLocalizedText } from "../../../utils/localizationUtils";
import type { AppDispatch, RootState } from "../../../redux/store";

// Styled-components for responsiveness
const Container = styled.div`
  padding: 20px;
  @media (max-width: 768px) {
    padding: 15px;
  }
  @media (max-width: 480px) {
    padding: 10px;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 20px;
  text-align: center;
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
  @media (max-width: 480px) {
    font-size: 1.2rem;
  }
`;

const CertificationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const CertificationCard = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  background-color: #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  h3 {
    font-size: 1.25rem;
    margin-bottom: 10px;
  }

  p {
    font-size: 0.9rem;
    color: #555;
  }

  progress {
    width: 100%;
    height: 20px;
    margin-top: 10px;
  }

  @media (max-width: 768px) {
    h3 {
      font-size: 1rem;
    }
    p {
      font-size: 0.8rem;
    }
    progress {
      height: 15px;
    }
  }
`;

const ErrorMessage = styled.div`
  color: red;
  text-align: center;
  margin: 20px 0;
`;

// Utility function to calculate progress
const calculateProgress = (issueDate: string, expiryDate?: string): number => {
  const now = new Date();
  const issued = new Date(issueDate);
  const expiry = expiryDate
    ? new Date(expiryDate)
    : new Date(now.getFullYear() + 1, now.getMonth(), now.getDate()); // Default expiry to 1 year after issue
  const totalDuration = expiry.getTime() - issued.getTime();
  const elapsed = now.getTime() - issued.getTime();
  return Math.min(100, Math.max(0, Math.floor((elapsed / totalDuration) * 100))); // Clamp between 0-100
};

// Component
const CertificationTracker: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Use strongly-typed selectors
  const { certifications, loading, error } = useSelector(
    (state: RootState) => state.certifications
  );

  // Fetch certifications on mount
  useEffect(() => {
    dispatch(fetchCertifications());
  }, [dispatch]);

  return (
    <Container>
      <Title>{getLocalizedText("certificationTrackerTitle", "certifications")}</Title>

      {loading && <p>{getLocalizedText("loading", "common")}</p>}

      {error && (
        <ErrorMessage>
          {getLocalizedText("errorFetchingCertifications", "certifications")}
        </ErrorMessage>
      )}

      {!loading && !error && (
        <CertificationGrid>
          {certifications.map((cert) => (
            <CertificationCard key={cert.id}>
              <h3>{cert.name}</h3>
              <p>{cert.description}</p>
              <progress
                value={calculateProgress(cert.issueDate, cert.expiryDate)}
                max="100"
                aria-label={`${cert.name} progress: ${calculateProgress(cert.issueDate, cert.expiryDate)}%`}
              />
              <p>
                {calculateProgress(cert.issueDate, cert.expiryDate)}%{" "}
                {getLocalizedText("completed", "certifications")}
              </p>
            </CertificationCard>
          ))}
        </CertificationGrid>
      )}
    </Container>
  );
};

export default CertificationTracker;
