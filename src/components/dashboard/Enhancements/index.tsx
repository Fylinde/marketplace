import React from "react";
import AIInsights from "./AIInsights";
import CertificationTracker from "./CertificationTracker";
import OmniChannelIntegration from "./OmniChannelIntegration";
import PersonalizedDashboard from "./PersonalizedDashboard";
import SustainabilityMetrics from "./SustainabilityMetrics";
import TrainingPortal from "./TrainingPortal";
import styled from "styled-components";

const Container = styled.div`
  padding: 20px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;

  @media (max-width: 768px) {
    padding: 15px;
  }
  @media (max-width: 480px) {
    padding: 10px;
  }
`;

const Enhancements: React.FC = () => {
  return (
    <Container>
      {/* AI Insights Component */}
      <AIInsights />

      {/* Certification Tracker Component */}
      <CertificationTracker />

      {/* Omni-Channel Integration Component */}
      <OmniChannelIntegration />

      {/* Personalized Dashboard Component */}
      <PersonalizedDashboard />

      {/* Sustainability Metrics Component */}
      <SustainabilityMetrics />

      {/* Training Portal Component */}
      <TrainingPortal />
    </Container>
  );
};

export default Enhancements;
