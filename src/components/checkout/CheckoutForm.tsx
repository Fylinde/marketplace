import { Formik, FormikHelpers } from "formik";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/store";
import {
  setShippingAddress,
  setBillingAddress,
} from "../../redux/slices/checkoutSlice";
import {
  loadAddresses,
  saveAddress,
  modifyAddress,
} from "../../redux/slices/addressSlice";
import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import * as yup from "yup";
import Button from "../buttons/Button";
import { Card1 } from "../Card1";
import CheckBox from "../CheckBox";
import Grid from "../grid/Grid";
import Select from "../Select";
import TextField from "../text-field/TextField";
import Typography from "../Typography";
import type { AppDispatch } from "../../redux/store";
import { Address } from "../../redux/slices/addressSlice";
import { SingleValue } from "react-select";

// FormValues Type Definition
interface FormValues {
  shipping: Address;
  billing: Address; 

  };

  interface SelectOption {
    label: string;
    value: string; // `value` must be a string
  }

  
const CheckoutForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { shippingAddress, billingAddress, countryList } = useSelector(
    (state: RootState) => state.checkout
  );
  const { addresses } = useSelector((state: RootState) => state.address);

  const [sameAsShipping, setSameAsShipping] = useState(false);
  const [useSavedShipping, setUseSavedShipping] = useState(false);
  const [useSavedBilling, setUseSavedBilling] = useState(false);

  useEffect(() => {
    dispatch(loadAddresses());
  }, [dispatch]);

  const initialValues: FormValues = {
    shipping: {
      id: "", // Assuming this is required
      fullName: "",
      email: "",
      phone: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      isDefault: false, // Default to false
    },
    billing: {
      id: "",
      fullName: "",
      email: "",
      phone: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      isDefault: false,
    },
  };
  

  const checkoutSchema = yup.object().shape({
    shipping: yup.object().shape({
      fullName: yup.string().required("Required"),
      email: yup.string().email("Invalid email").required("Required"),
      phone: yup.string().required("Required"),
      addressLine1: yup.string().required("Required"),
      addressLine2: yup.string(),
      city: yup.string().required("Required"),
      state: yup.string().required("Required"),
      zipCode: yup.string().required("Required"),
      country: yup.string().required("Required"),
    }),
    billing: yup.object().shape({
      fullName: yup.string().required("Required"),
      email: yup.string().email("Invalid email").required("Required"),
      phone: yup.string().required("Required"),
      addressLine1: yup.string().required("Required"),
      addressLine2: yup.string(),
      city: yup.string().required("Required"),
      state: yup.string().required("Required"),
      zipCode: yup.string().required("Required"),
      country: yup.string().required("Required"),
    }),
  });
  

  const handleFormSubmit = (
    values: FormValues,
    formikHelpers: FormikHelpers<FormValues>
  ) => {
    // Map shipping form values to Address type
    const shippingAddress: Address = {
      id: "",
      fullName: values.shipping.fullName,
      email: values.shipping.email,
      phone: values.shipping.phone,
      addressLine1: values.shipping.addressLine1,
      addressLine2: values.shipping.addressLine2,
      city: "",
      state: "",
      zipCode: values.shipping.zipCode,
      country: values.shipping.country,
      isDefault: false,
    };
  
    // Map billing form values to Address type
    const billingAddress: Address = {
      id: "",
      fullName: values.billing.fullName,
      email: values.billing.email,
      phone: values.billing.phone,
      addressLine1: values.billing.addressLine1,
      addressLine2: values.billing.addressLine2,
      city: "",
      state: "",
      zipCode: values.billing.zipCode,
      country: values.billing.country,
      isDefault: false,
    };
  
    // Dispatch mapped addresses
    dispatch(setShippingAddress(shippingAddress));
    if (!sameAsShipping) {
      dispatch(setBillingAddress(billingAddress));
    } else {
      dispatch(setBillingAddress(shippingAddress));
    }
  
    navigate("/payment");
  };
  
  
  

  return (
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
        setFieldValue,
      }) => (
        <form onSubmit={handleSubmit}>
          <Card1 mb="2rem">
            <Typography fontWeight="600" mb="1rem">
              Shipping Address
            </Typography>
            <Select
                  label="Use Saved Shipping Address"
                  options={addresses.map((address: Address) => ({
                    label: `${address.fullName} (${address.addressLine1})`,
                    value: address.id, // Use a unique string value
                  }))} 
                  value={
                    useSavedShipping
                      ? {
                          label: `${addresses[0]?.fullName} (${addresses[0]?.addressLine1})`,
                          value: addresses[0]?.id,
                        }
                      : undefined
                  }
                  onChange={(option) => {
                    setUseSavedShipping(!!option);
                    if (option) {
                      const selectedAddress = addresses.find(
                        (address: Address) => address.id === option.value
                      );
                      setFieldValue("shipping", selectedAddress);
                    }
                  }}
                />


            {!useSavedShipping && (
              <Grid container spacing={7}>
                <Grid item sm={6} xs={12}>
                  <TextField
                    name="shipping.name"
                    label="Full Name"
                    fullwidth
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.shipping.fullName}
                    errorText={
                      touched.shipping?.fullName && errors.shipping?.fullName
                    }
                  />
                  <TextField
                    name="shipping.contact"
                    label="Phone Number"
                    fullwidth
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.shipping.phone}
                    errorText={
                      touched.shipping?.phone &&
                      errors.shipping?.phone
                    }
                  />
                </Grid>
                <Grid item sm={6} xs={12}>
                <Select
                  label="Country"
                  options={countryList}
                  value={countryList.find(
                    (country: SelectOption) => country.value === values.shipping.country
                  )}
                  onChange={(selectedOption: SingleValue<SelectOption> | null) => {
                    if (selectedOption) {
                      setFieldValue("shipping.country", selectedOption.value);
                    } else {
                      setFieldValue("shipping.country", ""); // Reset the value if `null`
                    }
                  }}
                  errorText={
                    touched.shipping?.country && errors.shipping?.country
                      ? String(errors.shipping?.country)
                      : undefined
                  }
                />


                </Grid>
              </Grid>
            )}
          </Card1>
          <Grid container spacing={7}>
            <Grid item sm={6} xs={12}>
              <Link to="/cart">
                <Button variant="outlined" color="primary">
                  Back to Cart
                </Button>
              </Link>
            </Grid>
            <Grid item sm={6} xs={12}>
              <Button variant="contained" color="primary" type="submit">
                Proceed to Payment
              </Button>
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  );
};

export default CheckoutForm;
