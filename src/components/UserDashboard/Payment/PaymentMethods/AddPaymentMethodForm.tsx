import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { savePaymentMethod } from "../../../../redux/slices/orders/paymentSlice";
import { getLocalizedText } from "../../../../utils/localizationUtils";
import type { AppDispatch } from "../../../../redux/store";

const AddPaymentMethodForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState({
    type: "",
    name: "",
    details: "",
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const paymentMethod = {
        ...formData,
        currency: "USD", // Provide a default or dynamic value
        id: "generated-id", // Replace with a real ID if needed
      };
      await dispatch(savePaymentMethod(paymentMethod)).unwrap();
      alert(getLocalizedText("addSuccess", "paymentMethods"));
    } catch (error) {
      if (error instanceof Error) {
        alert(getLocalizedText("addError", "paymentMethods", { error: error.message }));
      } else {
        alert(getLocalizedText("unknownError", "paymentMethods"));
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{getLocalizedText("addPaymentMethod", "paymentMethods")}</h2>
      <label>
        {getLocalizedText("paymentType", "paymentMethods")}
        <select
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
        >
          <option value="">{getLocalizedText("selectType", "paymentMethods")}</option>
          <option value="creditCard">{getLocalizedText("creditCard", "paymentMethods")}</option>
          <option value="crypto">{getLocalizedText("cryptoWallet", "paymentMethods")}</option>
        </select>
      </label>
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

export default AddPaymentMethodForm;
