// src/components/Layout/MainContent.tsx
import React from "react";

const DashboardMainContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <main className="main-content">{children}</main>;
};

export default DashboardMainContent;
