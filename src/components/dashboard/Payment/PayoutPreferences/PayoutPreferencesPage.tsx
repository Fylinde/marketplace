import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPaymentMethods, setDefaultPayoutMethod } from "../../../../redux/slices/orders/paymentSlice";
import type { AppDispatch } from "../../../../redux/store";

const PayoutPreferencesPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { paymentMethods, loading, error, defaultPayoutMethod } = useSelector(
    (state: any) => state.payment
  );
  const [selectedMethod, setSelectedMethod] = useState(defaultPayoutMethod || "");

  useEffect(() => {
    dispatch(fetchPaymentMethods());
  }, [dispatch]);

  const handleSetDefault = async () => {
    if (!selectedMethod) {
      alert("Please select a payout method.");
      return;
    }
    try {
      await dispatch(setDefaultPayoutMethod(selectedMethod)).unwrap();
      alert("Default payout method updated successfully.");
    } catch (error) {
      const errorMessage = (error as { message?: string }).message || "An unexpected error occurred";
      alert(`Failed to set default payout method: ${errorMessage}`);
    }
  };

  if (loading) return <p>Loading payout preferences...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Payout Preferences</h2>
      <ul>
        {paymentMethods.map((method: any) => (
          <li key={method.id}>
            <input
              type="radio"
              id={`method-${method.id}`}
              name="payout-method"
              value={method.id}
              checked={selectedMethod === method.id}
              onChange={() => setSelectedMethod(method.id)}
            />
            <label htmlFor={`method-${method.id}`}>
              <strong>{method.name}</strong> ({method.type})
            </label>
          </li>
        ))}
      </ul>
      <button onClick={handleSetDefault}>Set as Default Payout Method</button>
    </div>
  );
};

export default PayoutPreferencesPage;
