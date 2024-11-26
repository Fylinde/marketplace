import React from "react";
import CheckoutForm from "../components/checkout/CheckoutForm";
import CheckoutSummary from "../components/checkout/CheckoutSummary";
import Grid from "../components/grid/Grid";
import CheckoutNavLayout from "../components/layout/CheckoutNavLayout";
import { PageWithLayout } from "../types/pageLayouts";

const Checkout: PageWithLayout = () => {
  return (
    <Grid container flexWrap="wrap-reverse" spacing={6}>
      {/* Left Section: Checkout Form */}
      <Grid item lg={8} md={8} xs={12}>
        <CheckoutForm />
      </Grid>

      {/* Right Section: Order Summary */}
      <Grid item lg={4} md={4} xs={12}>
        <CheckoutSummary />
      </Grid>
    </Grid>
  );
};

// Assign layout for the Checkout page
Checkout.layout = CheckoutNavLayout;

export default Checkout;
