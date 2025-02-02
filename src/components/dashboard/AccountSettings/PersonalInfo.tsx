import React, { useEffect } from 'react';
import TextField from '../../../components/text-field/TextField';
import Alert from '../../../components/Alert';
import CircularProgress from '../../../components/CircularProgress';
import Box from '../../../components/Box';
import Grid from '../../../components/grid/Grid';
import Button from '../../../components/buttons/Button';
import { useAppDispatch, useAppSelector } from '../../../redux/reduxHooks';
import { fetchAccountInfo, updateAccountInfo } from '../../../redux/slices/auth/accountSlice';
import * as yup from 'yup';
import { useFormik } from 'formik';

interface PersonalInfoProps {
  data: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
  };
  onUpdate: (updatedData: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
  }) => void;
}

const validationSchema = yup.object({
  firstName: yup.string().required('First Name is required'),
  lastName: yup.string().required('Last Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phoneNumber: yup
    .string()
    .matches(/^[0-9]+$/, 'Phone must be numeric')
    .required('Phone is required'),
});

const PersonalInfo: React.FC<PersonalInfoProps> = ({ data, onUpdate }) => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.account);

  // Fetch account info on mount
  useEffect(() => {
    dispatch(fetchAccountInfo());
  }, [dispatch]);

  // Formik for form handling
  const formik = useFormik({
    initialValues: {
      firstName: data?.firstName || '',
      lastName: data?.lastName || '',
      email: data?.email || '',
      phoneNumber: data?.phoneNumber || '',
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      // Dispatch update action
      await dispatch(updateAccountInfo(values));
      // Call the onUpdate callback
      onUpdate(values);
    },
  });

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box mb="30px">
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <Grid item md={6} xs={12}>
            <TextField
              label="First Name"
              name="firstName"
              value={formik.values.firstName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              errorText={formik.touched.firstName && formik.errors.firstName}
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <TextField
              label="Last Name"
              name="lastName"
              value={formik.values.lastName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              errorText={formik.touched.lastName && formik.errors.lastName}
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <TextField
              label="Email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              errorText={formik.touched.email && formik.errors.email}
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <TextField
              label="phoneNumber"
              name="phoneNumber"
              value={formik.values.phoneNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              errorText={formik.touched.phoneNumber && formik.errors.phoneNumber}
            />
          </Grid>
        </Grid>
        <Box mt={3} display="flex" justifyContent="flex-end">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={formik.isSubmitting || !formik.dirty || !formik.isValid}
          >
            Save Changes
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default PersonalInfo;
