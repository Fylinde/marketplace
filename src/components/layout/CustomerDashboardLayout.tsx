import React from "react";
import Container from "../Container";
import Grid from "../grid/Grid";
import Hidden from "../hidden/Hidden";
import Navbar from "../navbar/Navbar";
import CustomerDashboardNavigation from "./CustomerDashboardNavigation";
import AppLayout from "./AppLayout";

interface CustomerDashboardLayoutProps {
  children: React.ReactNode; // Explicitly type the 'children' prop
}

const CustomerDashboardLayout: React.FC<CustomerDashboardLayoutProps> = ({ children }): JSX.Element => (
  <AppLayout navbar={<Navbar />}>
    <Container my="2rem">
      <Grid container spacing={6}>
        <Hidden as={Grid} item lg={3} xs={12} down={1024}>
          <CustomerDashboardNavigation />
        </Hidden>
        <Grid item lg={9} xs={12}>
          {children}
        </Grid>
      </Grid>
    </Container>
  </AppLayout>
);

export default CustomerDashboardLayout;

