import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { savePaymentMethod } from "../../../../redux/slices/orders/paymentSlice";
import { useFormik } from "formik";
import * as Yup from "yup";
import type { AppDispatch } from "../../../../redux/store";

const AddPaymentMethodForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [paymentType, setPaymentType] = useState("");

  const formik = useFormik({
    initialValues: {
      type: "",
      name: "",
      details: "",
    },
    validationSchema: Yup.object({
      type: Yup.string().required("Payment type is required"),
      name: Yup.string().required("Name is required"),
      details: Yup.string().required("Payment details are required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const paymentMethod = {
          ...values,
          id: "", // Placeholder value, will be handled in the backend
          currency: "USD", // Default currency
        };
        await dispatch(savePaymentMethod(paymentMethod)).unwrap();
        alert("Payment method added successfully!");
        resetForm();
      } catch (error) {
        const errorMessage = (error as { message?: string }).message || "An unexpected error occurred";
        alert(`Error adding payment method: ${errorMessage}`);
      }
    },
  });

  const handlePaymentTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPaymentType(event.target.value);
    formik.setFieldValue("type", event.target.value);
  };

  const renderFields = () => {
    switch (paymentType) {
      case "crypto":
        return (
          <>
            <label htmlFor="details">Crypto Wallet Address</label>
            <input
              id="details"
              name="details"
              type="text"
              placeholder="Enter wallet address"
              value={formik.values.details}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.details && formik.errors.details && (
              <div className="error">{formik.errors.details}</div>
            )}
          </>
        );
      case "bank":
        return (
          <>
            <label htmlFor="details">Bank Account Number</label>
            <input
              id="details"
              name="details"
              type="text"
              placeholder="Enter account number"
              value={formik.values.details}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.details && formik.errors.details && (
              <div className="error">{formik.errors.details}</div>
            )}
          </>
        );
      case "thirdParty":
        return (
          <>
            <label htmlFor="details">Third-Party Service Account</label>
            <input
              id="details"
              name="details"
              type="text"
              placeholder="Enter account details"
              value={formik.values.details}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.details && formik.errors.details && (
              <div className="error">{formik.errors.details}</div>
            )}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <h2>Add Payment Method</h2>

      <label htmlFor="type">Payment Type</label>
      <select
        id="type"
        name="type"
        value={formik.values.type}
        onChange={handlePaymentTypeChange}
        onBlur={formik.handleBlur}
      >
        <option value="" label="Select payment type" />
        <option value="crypto" label="Cryptocurrency Wallet" />
        <option value="bank" label="Bank Account" />
        <option value="thirdParty" label="Third-Party Payment Service" />
      </select>
      {formik.touched.type && formik.errors.type && (
        <div className="error">{formik.errors.type}</div>
      )}

      <label htmlFor="name">Payment Method Name</label>
      <input
        id="name"
        name="name"
        type="text"
        placeholder="e.g., My Bitcoin Wallet"
        value={formik.values.name}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
      {formik.touched.name && formik.errors.name && (
        <div className="error">{formik.errors.name}</div>
      )}

      {renderFields()}

      <button type="submit">Save Payment Method</button>
    </form>
  );
};

export default AddPaymentMethodForm;
