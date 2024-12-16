import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updatePaymentMethod } from "../../../../redux/slices/orders/paymentSlice";
import { useFormik } from "formik";
import * as Yup from "yup";
import type { AppDispatch } from "../../../../redux/store";

const EditPaymentMethodForm = ({ paymentMethodId }: { paymentMethodId: string }) => {
  const dispatch = useDispatch<AppDispatch>();
  const paymentMethod = useSelector((state: any) =>
    state.payment.paymentMethods.find((method: any) => method.id === paymentMethodId)
  );

  const formik = useFormik({
    initialValues: {
      type: paymentMethod?.type || "",
      name: paymentMethod?.name || "",
      details: paymentMethod?.details || "",
    },
    enableReinitialize: true, // Allow updates when props change
    validationSchema: Yup.object({
      type: Yup.string().required("Payment type is required"),
      name: Yup.string().required("Name is required"),
      details: Yup.string().required("Payment details are required"),
    }),
    onSubmit: async (values) => {
      try {
        await dispatch(updatePaymentMethod({ id: paymentMethodId, updates: values })).unwrap();
        alert("Payment method updated successfully!");
      } catch (error) {
        const errorMessage = (error as { message?: string }).message || "An unexpected error occurred";
        alert(`Error updating payment method: ${errorMessage}`);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <h2>Edit Payment Method</h2>

      <label htmlFor="type">Payment Type</label>
      <select
        id="type"
        name="type"
        value={formik.values.type}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        disabled
      >
        <option value="crypto" label="Cryptocurrency Wallet" />
        <option value="bank" label="Bank Account" />
        <option value="thirdParty" label="Third-Party Payment Service" />
      </select>
      {formik.touched.type && typeof formik.errors.type === "string" && (
        <div className="error">{formik.errors.type}</div>
      )}

      <label htmlFor="name">Payment Method Name</label>
      <input
        id="name"
        name="name"
        type="text"
        value={formik.values.name}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
      {formik.touched.name && typeof formik.errors.name === "string" && (
        <div className="error">{formik.errors.name}</div>
      )}

      <label htmlFor="details">Payment Details</label>
      <input
        id="details"
        name="details"
        type="text"
        value={formik.values.details}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
      {formik.touched.details && typeof formik.errors.details === "string" && (
        <div className="error">{formik.errors.details}</div>
      )}

      <button type="submit">Update Payment Method</button>
    </form>
  );
};

export default EditPaymentMethodForm;
