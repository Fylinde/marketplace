import React from "react";
import Container from "../Container";
import Grid from "../grid/Grid";
import Hidden from "../hidden/Hidden";
import Navbar from "../navbar/Navbar";
import VendorDashboardNavigation from "./VendorDashboardNavigation";
import AppLayout from "./AppLayout";

interface VendorDashboardLayoutProps {
  children?: React.ReactNode;  // Make children optional if necessary
}

const VendorDashboardLayout: React.FC<VendorDashboardLayoutProps> = ({ children }) => (
  <AppLayout navbar={<Navbar />}>
    <Container my="2rem">
      <Grid container spacing={6}>
        <Hidden as={Grid} item lg={3} xs={12} down={1024}>
          <VendorDashboardNavigation />
        </Hidden>
        <Grid item lg={9} xs={12}>
          {children}
        </Grid>
      </Grid>
    </Container>
  </AppLayout>
);

export default VendorDashboardLayout;
