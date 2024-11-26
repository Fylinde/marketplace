import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import * as yup from "yup";
import { format } from "date-fns";
import axios from "axios";

import Avatar from "components/avatar/Avatar";
import Box from "components/Box";
import Card from "components/Card";
import FlexBox from "components/FlexBox";
import Select from "components/Select";
import TextField from "components/text-field/TextField";
import Typography, { H6, Paragraph } from "components/Typography";
import Button from "components/buttons/Button";
import Grid from "components/grid/Grid";

import { setDeliveryOption, setPaymentMethod, applyDiscount } from "../../redux/slices/checkoutSlice";
import { loadAddresses } from "../../redux/slices/addressSlice";
import type { AppDispatch, RootState } from "../../redux/store";
import { Address } from "../../redux/slices/addressSlice";


// Define types for form values
interface FormValues {
  address: string;
  contact: string;
  card: string;
  date: string;
  time: string;
  voucher: string;
}

// Define types for Select options
interface SelectOption {
  label: string;
  value: string;
}

// Use user's timezone dynamically if `date-fns-tz` is not available
const getCurrentTimezone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;

const CheckoutForm2 = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { addresses } = useSelector((state: RootState) => state.address);
  const { deliveryOption, paymentMethod } = useSelector((state: RootState) => state.checkout);

  const [dateList, setDateList] = useState<SelectOption[]>([]);
  const [timeList, setTimeList] = useState<SelectOption[]>([]);
  const [hasVoucher, setHasVoucher] = useState(false);

  const fetchTimeSlots = async (selectedDate: string) => {
    try {
      const response = await axios.get(`/api/delivery-time-slots`, {
        params: { date: selectedDate },
      });
      const slots = response.data.map((slot: { label: string; value: string }) => ({
        label: slot.label,
        value: slot.value,
      }));
      setTimeList(slots);
    } catch (error) {
      console.error("Failed to fetch delivery time slots", error);
    }
  };

  useEffect(() => {
    const list: SelectOption[] = [];
    let today = new Date();

    for (let i = 0; i < 10; i++) {
      list.push({
        label: format(today, "dd MMMM"),
        value: today.toISOString(),
      });
      today.setDate(today.getDate() + 1);
    }
    setDateList(list);

    fetchTimeSlots(new Date().toISOString());
    dispatch(loadAddresses());
  }, [dispatch]);

  const handleFormSubmit = (values: FormValues) => {
    const selectedAddress = addresses.find((address: Address) => address.id === values.address);

    if (selectedAddress) {
      const deliveryOptionPayload = {
        ...deliveryOption,
        date: values.date,
        time: values.time,
        price: deliveryOption?.price ?? 0,
      };

      dispatch(setDeliveryOption(deliveryOptionPayload));
      if (paymentMethod) {
        dispatch(setPaymentMethod(paymentMethod));
      } else {
        console.error("Payment method is null, cannot dispatch setPaymentMethod");
      }
    }

    navigate("/payment");
  };

  const handleDateChange = (selectedDate: string) => {
    fetchTimeSlots(selectedDate);
  };

  const checkoutSchema = yup.object().shape({
    address: yup.string().required("Delivery address is required"),
    contact: yup.string().required("Contact information is required"),
    card: yup.string().required("Payment method is required"),
    date: yup.string().required("Delivery date is required"),
    time: yup.string().required("Delivery time is required"),
    voucher: yup.string(),
  });

  return (
    <Formik
      initialValues={{
        address: "",
        contact: "",
        card: "",
        date: "",
        time: "",
        voucher: "",
      }}
      validationSchema={checkoutSchema}
      onSubmit={handleFormSubmit}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleSubmit,
        setFieldValue,
      }) => (
        <form onSubmit={handleSubmit}>
          <Card mb="1.5rem">
            <FlexBox alignItems="center" mb="1.75rem">
              <Avatar bg="primary.main" size={32} color="primary.text" mr="0.875rem">
                1
              </Avatar>
              <Typography fontSize="20px">Delivery Details</Typography>
            </FlexBox>

            <Box mb="1.75rem">
              <Grid container spacing={6}>
                <Grid item sm={6} xs={12}>
                  <Select
                    label="Delivery Date"
                    options={dateList}
                    value={dateList.find((date) => date.value === values.date)}
                    onChange={(option) => {
                      const selectedDate = option?.value || "";
                      setFieldValue("date", selectedDate);
                      handleDateChange(selectedDate);
                    }}
                    errorText={touched.date && typeof errors.date === "string" ? errors.date : undefined}
                  />
                </Grid>
                <Grid item sm={6} xs={12}>
                  <Select
                    label="Delivery Time"
                    options={timeList}
                    value={timeList.find((time) => time.value === values.time)}
                    onChange={(option) => setFieldValue("time", option?.value || "")}
                    errorText={touched.time && typeof errors.time === "string" ? errors.time : undefined}
                  />
                </Grid>
              </Grid>
            </Box>

            <Typography mb="0.75rem">Delivery Address</Typography>
            <Grid container spacing={6}>
              {addresses.map((item: Address) => (
                <Grid item md={4} sm={6} xs={12} key={item.id}>
                  <Card
                    bg="gray.100"
                    p="1rem"
                    boxShadow="none"
                    border="1px solid"
                    cursor="pointer"
                    borderColor={item.id === values.address ? "primary.main" : "transparent"}
                    onClick={() => setFieldValue("address", item.id)}
                  >
                    <H6 mb="0.25rem">{item.fullName}</H6>
                    <Paragraph color="gray.700">{item.addressLine1}</Paragraph>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Card>

          {/* Payment Method */}
          <Card mb="1.5rem">
            <FlexBox alignItems="center" mb="1.75rem">
              <Avatar bg="primary.main" size={32} color="primary.text" mr="0.875rem">
                2
              </Avatar>
              <Typography fontSize="20px">Payment Details</Typography>
            </FlexBox>
          </Card>

          <Button variant="contained" color="primary" mt="1.5rem" type="submit" fullwidth>
            Place Order
          </Button>
        </form>
      )}
    </Formik>
  );
};

export default CheckoutForm2;
