import React from "react";
import styled from "styled-components";

const ContentContainer = styled.div`
  padding: 24px;
  background: #fff;
  min-height: 100vh;
`;

const DashboardMainContent: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ContentContainer>{children}</ContentContainer>
);

export default DashboardMainContent;
