import React, { Fragment, useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import Typography from "../Typography";
import Grid from "../grid/Grid";
import TextField from "../text-field/TextField";
import Button from "../buttons/Button";
import { Link, useNavigate } from "react-router-dom"; 
import { Card1 } from "../Card1";
import Radio from "../radio/Radio";
import FlexBox from "../FlexBox";
import Divider from "../Divider";
import Box from "../Box";
import useWindowSize from "../../hooks/useWindowSize";

// Define the form values type
interface FormValues {
  card_no: string;
  name: string;
  exp_date: string;
  cvc: string;
}

const PaymentForm = () => {
  const [paymentMethod, setPaymentMethod] = useState("credit-card");

  // Use destructuring to get width correctly
  const { width } = useWindowSize();
  const navigate = useNavigate();  // useNavigate replaces useRouter for navigation
  const isMobile = width < 769;

  const handleFormSubmit = async (values: FormValues) => {
    console.log(values);
    navigate("/payment");  // Replaces router.push with navigate
  };

  const handlePaymentMethodChange = ({ target: { name } }: { target: { name: string } }) => {
    setPaymentMethod(name);
  };

  return (
    <Fragment>
      <Card1 mb="2rem">
        <Radio
          name="credit-card"
          mb="1.5rem"
          color="secondary"
          checked={paymentMethod === "credit-card"}
          label={
            <Typography ml="6px" fontWeight="600" fontSize="18px">
              Pay with credit card
            </Typography>
          }
          onChange={handlePaymentMethodChange}
        />

        <Divider mb="1.25rem" mx="-2rem" />

        {paymentMethod === "credit-card" && (
          <Formik
            initialValues={initialValues}
            validationSchema={checkoutSchema}
            onSubmit={handleFormSubmit}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
            }) => (
              <form onSubmit={handleSubmit}>
                <Box mb="1.5rem">
                  <Grid container horizontal_spacing={6} vertical_spacing={4}>
                    <Grid item sm={6} xs={12}>
                      <TextField
                        name="card_no"
                        label="Card Number"
                        fullwidth
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.card_no || ""}
                        errorText={touched.card_no && errors.card_no}
                      />
                    </Grid>
                    <Grid item sm={6} xs={12}>
                      <TextField
                        name="exp_date"
                        label="Exp Date"
                        placeholder="MM/YY"
                        fullwidth
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.exp_date || ""}
                        errorText={touched.exp_date && errors.exp_date}
                      />
                    </Grid>
                    <Grid item sm={6} xs={12}>
                      <TextField
                        name="name"
                        label="Name on Card"
                        fullwidth
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.name || ""}
                        errorText={touched.name && errors.name}
                      />
                    </Grid>
                    <Grid item sm={6} xs={12}>
                      <TextField
                        name="cvc"
                        label="CVC"
                        fullwidth
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.cvc || ""}
                        errorText={touched.cvc && errors.cvc}
                      />
                    </Grid>
                  </Grid>
                </Box>

                <Button variant="outlined" color="primary" mb="30px" type="submit">
                  Submit
                </Button>

                <Divider mb="1.5rem" mx="-2rem" />
              </form>
            )}
          </Formik>
        )}

        <Radio
          name="paypal"
          mb="1.5rem"
          color="secondary"
          checked={paymentMethod === "paypal"}
          label={
            <Typography ml="6px" fontWeight="600" fontSize="18px">
              Pay with Paypal
            </Typography>
          }
          onChange={handlePaymentMethodChange}
        />
        <Divider mb="1.5rem" mx="-2rem" />

        {paymentMethod === "paypal" && (
          <Fragment>
            <FlexBox alignItems="flex-end" mb="30px">
              <TextField
                name="email"
                label="Paypal Email"
                type="email"
                mr={isMobile ? "1rem" : "30px"}
                fullwidth
              />
              <Button variant="outlined" color="primary" type="button">
                Submit
              </Button>
            </FlexBox>

            <Divider mb="1.5rem" mx="-2rem" />
          </Fragment>
        )}

        <Radio
          name="cod"
          color="secondary"
          checked={paymentMethod === "cod"}
          label={
            <Typography ml="6px" fontWeight="600" fontSize="18px">
              Cash On Delivery
            </Typography>
          }
          onChange={handlePaymentMethodChange}
        />
      </Card1>

      <Grid container spacing={7}>
        <Grid item sm={6} xs={12}>
          <Link to="/checkout">
            <Button variant="outlined" color="primary" type="button" fullwidth>
              Back to checkout details
            </Button>
          </Link>
        </Grid>
        <Grid item sm={6} xs={12}>
          <Link to="/orders">
            <Button variant="contained" color="primary" type="submit" fullwidth>
              Review
            </Button>
          </Link>
        </Grid>
      </Grid>
    </Fragment>
  );
};

const initialValues: FormValues = {
  card_no: "",
  name: "",
  exp_date: "",
  cvc: "",
};

const checkoutSchema = yup.object().shape({
  card_no: yup.string().required("required"),
  name: yup.string().required("required"),
  exp_date: yup.string().required("required"),
  cvc: yup.string().required("required"),
});

export default PaymentForm;
