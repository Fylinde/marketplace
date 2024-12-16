import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updatePaymentMethod } from "../../../../redux/slices/orders/paymentSlice";
import { useParams } from "react-router-dom";
import { getLocalizedText } from "../../../../utils/localizationUtils";
import type { AppDispatch } from "../../../../redux/store";

const EditPaymentMethodForm = () => {
  const { id } = useParams();

  if (!id) {
    throw new Error("Payment method ID is required.");
  }

  const dispatch = useDispatch<AppDispatch>();
  const paymentMethod = useSelector((state: any) =>
    state.payment.paymentMethods.find((method: any) => method.id === id)
  );

  const [formData, setFormData] = useState({
    name: paymentMethod?.name || "",
    details: paymentMethod?.details || "",
  });

  useEffect(() => {
    if (paymentMethod) {
      setFormData({
        name: paymentMethod.name,
        details: paymentMethod.details,
      });
    }
  }, [paymentMethod]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await dispatch(updatePaymentMethod({ id, updates: formData })).unwrap();
      alert(getLocalizedText("updateSuccess", "paymentMethods"));
    } catch (error) {
      if (error instanceof Error) {
        alert(getLocalizedText("updateError", "paymentMethods", { error: error.message }));
      } else {
        alert(getLocalizedText("unknownError", "paymentMethods"));
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{getLocalizedText("editPaymentMethod", "paymentMethods")}</h2>
      <label>
        {getLocalizedText("name", "common")}
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </label>
      <label>
        {getLocalizedText("details", "paymentMethods")}
        <input
          type="text"
          value={formData.details}
          onChange={(e) => setFormData({ ...formData, details: e.target.value })}
        />
      </label>
      <button type="submit">{getLocalizedText("save", "common")}</button>
    </form>
  );
};

export default EditPaymentMethodForm;
