
import Avatar from "../../components/avatar/Avatar";
import Box from "../../components/Box";
import Button from "../../components/buttons/Button";
import { Card1 } from "../../components/Card1";
import FlexBox from "../../components/FlexBox";
import Grid from "../../components/grid/Grid";
import Hidden from "../../components/hidden/Hidden";
import Icon from "../../components/icon/Icon";
import CustomerDashboardLayout from "../../components/layout/CustomerDashboardLayout";
import DashboardPageHeader from "../../components/layout/DashboardPageHeader";
import TextField from "../../components/text-field/TextField";
import { Formik } from "formik";
import { Link } from "react-router-dom";
import React from "react";
import * as yup from "yup";

// Define an interface for form values
interface FormValues {
  first_name: string;
  last_name: string;
  email: string;
  contact: string;
  birth_date: string;
}

const ProfileEditor = () => {
  // Annotate the handleFormSubmit function with FormValues type
  const handleFormSubmit = async (values: FormValues) => {
    console.log(values);
  };

  return (
    <div>
      <DashboardPageHeader
        iconName="user_filled"
        title="Edit Profile"
        button={
          <Link to="/profile">
            <Button color="primary" bg="primary.light" px="2rem">
              Back to Profile
            </Button>
          </Link>
        }
      />

      <Card1>
        <FlexBox alignItems="flex-end" mb="22px">
          <Avatar src="/assets/images/faces/ralph.png" size={64} />

          <Box ml="-20px" style={{ zIndex: 1 }}>
            <label htmlFor="profile-image">
              <Button
                as="span"
                size="small"
                bg="gray.300"
                color="secondary"
                height="auto"
                p="6px"
                borderRadius="50%"
              >
                <Icon>camera</Icon>
              </Button>
            </label>
          </Box>
          <Hidden>
            <input
              className="hidden"
              onChange={(e) => console.log(e.target.files)}
              id="profile-image"
              accept="image/*"
              type="file"
            />
          </Hidden>
        </FlexBox>

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
              <Box mb="30px">
                <Grid container horizontal_spacing={6} vertical_spacing={4}>
                  <Grid item md={6} xs={12}>
                    <TextField
                      name="first_name"
                      label="First Name"
                      fullwidth
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.first_name || ""}
                      errorText={touched.first_name && errors.first_name}
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <TextField
                      name="last_name"
                      label="Last Name"
                      fullwidth
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.last_name || ""}
                      errorText={touched.last_name && errors.last_name}
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <TextField
                      name="email"
                      type="email"
                      label="Email"
                      fullwidth
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.email || ""}
                      errorText={touched.email && errors.email}
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <TextField
                      name="contact"
                      label="Phone"
                      fullwidth
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.contact || ""}
                      errorText={touched.contact && errors.contact}
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <TextField
                      name="birth_date"
                      label="Birth Date"
                      type="date"
                      fullwidth
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.birth_date || ""}
                      errorText={touched.birth_date && errors.birth_date}
                    />
                  </Grid>
                </Grid>
              </Box>

              <Button type="submit" variant="contained" color="primary">
                Save Changes
              </Button>
            </form>
          )}
        </Formik>
      </Card1>
    </div>
  );
};

// Define the initial values
const initialValues: FormValues = {
  first_name: "",
  last_name: "",
  email: "",
  contact: "",
  birth_date: "",
};

// Define the validation schema
const checkoutSchema = yup.object().shape({
  first_name: yup.string().required("required"),
  last_name: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  contact: yup.string().required("required"),
  birth_date: yup.date().required("invalid date"),
});

ProfileEditor.layout = CustomerDashboardLayout;

export default ProfileEditor;
