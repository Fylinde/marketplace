import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFulfillmentOptions,
  addFulfillmentOption,
  updateFulfillmentOption,
  deleteFulfillmentOption,
} from "../../../redux/slices/logistics/fulfillmentSlice";
import { getLocalizedText } from "../../../utils/localizationUtils";
import type { AppDispatch, RootState } from "../../../redux/store";

const FulfillmentOptions = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { options, loading, error } = useSelector((state: RootState) => state.fulfillment);
  const [newOption, setNewOption] = useState({
    name: "",
    description: "",
    type: "shipping" as "shipping" | "pickup" | "courier",
    price: 0,
    estimatedDeliveryTime: "",
  });
  const [editingOptionId, setEditingOptionId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchFulfillmentOptions());
  }, [dispatch]);

  const handleAddOption = async () => {
    if (
      !newOption.name ||
      newOption.price <= 0 ||
      !newOption.description ||
      !newOption.estimatedDeliveryTime
    ) {
      alert(getLocalizedText("invalidInput", "fulfillmentOptions"));
      return;
    }

    try {
      await dispatch(addFulfillmentOption(newOption)).unwrap();
      alert(getLocalizedText("optionAdded", "fulfillmentOptions"));
      setNewOption({ name: "", description: "", type: "shipping", price: 0, estimatedDeliveryTime: "" });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      alert(getLocalizedText("addOptionError", "fulfillmentOptions", { error: errorMessage }));
    }
  };

  const handleUpdateOption = async () => {
    if (!editingOptionId || !newOption.name || newOption.price <= 0) {
      alert(getLocalizedText("invalidInput", "fulfillmentOptions"));
      return;
    }

    try {
      await dispatch(updateFulfillmentOption({ id: editingOptionId, updates: newOption })).unwrap();
      alert(getLocalizedText("optionUpdated", "fulfillmentOptions"));
      setEditingOptionId(null);
      setNewOption({ name: "", description: "", type: "shipping", price: 0, estimatedDeliveryTime: "" });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      alert(getLocalizedText("updateOptionError", "fulfillmentOptions", { error: errorMessage }));
    }
  };

  const handleDeleteOption = async (id: string) => {
    if (window.confirm(getLocalizedText("confirmDelete", "fulfillmentOptions"))) {
      try {
        await dispatch(deleteFulfillmentOption(id)).unwrap();
        alert(getLocalizedText("optionDeleted", "fulfillmentOptions"));
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        alert(getLocalizedText("deleteOptionError", "fulfillmentOptions", { error: errorMessage }));
      }
    }
  };

  const renderOptionsList = () => (
    <div className="options-list">
      <h3>{getLocalizedText("currentOptions", "fulfillmentOptions")}</h3>
      <ul>
        {options.map((option) => (
          <li key={option.id}>
            <p>
              <strong>{getLocalizedText("name", "common")}: </strong>
              {option.name}
            </p>
            <p>
              <strong>{getLocalizedText("description", "fulfillmentOptions")}: </strong>
              {option.description}
            </p>
            <p>
              <strong>{getLocalizedText("type", "fulfillmentOptions")}: </strong>
              {option.type}
            </p>
            <p>
              <strong>{getLocalizedText("price", "fulfillmentOptions")}: </strong>
              {option.price}
            </p>
            <p>
              <strong>{getLocalizedText("estimatedDeliveryTime", "fulfillmentOptions")}: </strong>
              {option.estimatedDeliveryTime}
            </p>
            <button onClick={() => setEditingOptionId(option.id)}>
              {getLocalizedText("edit", "common")}
            </button>
            <button onClick={() => handleDeleteOption(option.id)}>
              {getLocalizedText("delete", "common")}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );

  if (loading) return <p>{getLocalizedText("loading", "common")}</p>;
  if (error) {
    const errorMessage = typeof error === "string" ? error : "An unknown error occurred";
    return (
      <p>
        {getLocalizedText("errorFetchingOptions", "fulfillmentOptions", { error: errorMessage })}
      </p>
    );
  }

  return (
    <div className="fulfillment-options">
      <h1>{getLocalizedText("fulfillmentOptions", "fulfillmentOptions")}</h1>
      <div className="options-form">
        <h3>
          {editingOptionId
            ? getLocalizedText("editOption", "fulfillmentOptions")
            : getLocalizedText("addNewOption", "fulfillmentOptions")}
        </h3>
        <input
          type="text"
          placeholder={getLocalizedText("name", "fulfillmentOptions")}
          value={newOption.name}
          onChange={(e) => setNewOption({ ...newOption, name: e.target.value })}
        />
        <input
          type="text"
          placeholder={getLocalizedText("description", "fulfillmentOptions")}
          value={newOption.description}
          onChange={(e) => setNewOption({ ...newOption, description: e.target.value })}
        />
        <select
          value={newOption.type}
          onChange={(e) => setNewOption({ ...newOption, type: e.target.value as "shipping" | "pickup" | "courier" })}
        >
          <option value="shipping">{getLocalizedText("shipping", "fulfillmentOptions")}</option>
          <option value="pickup">{getLocalizedText("pickup", "fulfillmentOptions")}</option>
          <option value="courier">{getLocalizedText("courier", "fulfillmentOptions")}</option>
        </select>
        <input
          type="number"
          placeholder={getLocalizedText("price", "fulfillmentOptions")}
          value={newOption.price}
          onChange={(e) => setNewOption({ ...newOption, price: parseFloat(e.target.value) })}
        />
        <input
          type="text"
          placeholder={getLocalizedText("estimatedDeliveryTime", "fulfillmentOptions")}
          value={newOption.estimatedDeliveryTime}
          onChange={(e) => setNewOption({ ...newOption, estimatedDeliveryTime: e.target.value })}
        />
        <button onClick={editingOptionId ? handleUpdateOption : handleAddOption}>
          {editingOptionId
            ? getLocalizedText("updateOption", "fulfillmentOptions")
            : getLocalizedText("addOption", "fulfillmentOptions")}
        </button>
      </div>
      {renderOptionsList()}
    </div>
  );
};

export default FulfillmentOptions;
