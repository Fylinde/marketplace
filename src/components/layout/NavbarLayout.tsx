import React from "react";
import Container from "../Container";
import Navbar from "../navbar/Navbar";
import AppLayout from "./AppLayout";

interface NavbarLayoutProps {
  children: React.ReactNode; // Explicitly define the 'children' prop
}

const NavbarLayout: React.FC<NavbarLayoutProps> = ({ children }) => {
  return (
    <AppLayout navbar={<Navbar />}>
      <Container my="2rem">{children}</Container>
    </AppLayout>
  );
};

export default NavbarLayout;
