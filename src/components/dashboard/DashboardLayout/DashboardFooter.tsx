import React from "react";
import styled from "styled-components";

const FooterContainer = styled.div`
  text-align: center;
  padding: 10px 0;
  background: #f0f2f5;
`;

const DashboardFooter: React.FC = () => (
  <FooterContainer>
    &copy; {new Date().getFullYear()} Your Company. All rights reserved. | <a href="/terms">Terms</a> | <a href="/privacy">Privacy</a>
  </FooterContainer>
);

export default DashboardFooter;
