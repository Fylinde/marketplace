import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPaymentMethods,
  deletePaymentMethod,
  setDefaultPaymentMethod,
  reorderPaymentMethods,
} from "../../../../redux/slices/orders/paymentSlice";
import { useNavigate } from "react-router-dom";
import type { AppDispatch } from "../../../../redux/store";

const PaymentMethodsPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { paymentMethods, defaultPaymentMethod, loading, error } = useSelector(
    (state: any) => state.payment
  );

  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  // Fetch payment methods on component mount
  useEffect(() => {
    dispatch(fetchPaymentMethods());
  }, [dispatch]);

  // Handle delete payment method
  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this payment method?")) {
      try {
        await dispatch(deletePaymentMethod(id)).unwrap();
        alert("Payment method deleted successfully.");
      } catch (error) {
        const errorMessage = (error as { message?: string }).message || "An unexpected error occurred";
        alert(`Failed to delete payment method: ${errorMessage}`);
      }
    }
  };

  // Handle set default payment method
  const handleSetDefault = async (id: string) => {
    try {
      await dispatch(setDefaultPaymentMethod(id)).unwrap();
      alert("Default payment method updated successfully.");
    } catch (error) {
      const errorMessage = (error as { message?: string }).message || "An unexpected error occurred";
      alert(`Failed to set default payment method: ${errorMessage}`);
    }
  };

  // Handle drag start for reordering
  const handleDragStart = (id: string) => {
    setDraggedItem(id);
  };

  // Handle drop for reordering
  const handleDrop = async (targetId: string) => {
    if (draggedItem && draggedItem !== targetId) {
      const reorderedMethods = [...paymentMethods];
      const draggedIndex = reorderedMethods.findIndex((method) => method.id === draggedItem);
      const targetIndex = reorderedMethods.findIndex((method) => method.id === targetId);

      // Reorder array
      const [removed] = reorderedMethods.splice(draggedIndex, 1);
      reorderedMethods.splice(targetIndex, 0, removed);

      try {
        await dispatch(reorderPaymentMethods(reorderedMethods)).unwrap();
        alert("Payment methods reordered successfully.");
      } catch (error) {
        const errorMessage = (error as { message?: string }).message || "An unexpected error occurred";
        alert(`Failed to reorder payment methods: ${errorMessage}`);
      }
    }
    setDraggedItem(null);
  };

  if (loading) return <p>Loading payment methods...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Your Payment Methods</h2>
      <button onClick={() => navigate("/seller-dashboard/payment/add")}>Add Payment Method</button>

      <ul>
        {paymentMethods.map((method: any) => (
          <li
            key={method.id}
            draggable
            onDragStart={() => handleDragStart(method.id)}
            onDrop={() => handleDrop(method.id)}
            onDragOver={(e) => e.preventDefault()}
            style={{
              padding: "10px",
              margin: "5px 0",
              border: "1px solid #ccc",
              borderRadius: "5px",
              backgroundColor: draggedItem === method.id ? "#f0f0f0" : "#fff",
            }}
          >
            <div>
              <strong>{method.name}</strong> ({method.type}){" "}
              {method.id === defaultPaymentMethod && <span>(Default)</span>}
            </div>
            <div>
              <button onClick={() => navigate(`/seller-dashboard/payment/edit/${method.id}`)}>
                Edit
              </button>
              <button onClick={() => handleDelete(method.id)}>Delete</button>
              {method.id !== defaultPaymentMethod && (
                <button onClick={() => handleSetDefault(method.id)}>Set as Default</button>
              )}
            </div>
          </li>
        ))}
      </ul>

      <div>
        <h3>Analytics</h3>
        <p>Most Preferred by Buyers: {paymentMethods[0]?.name || "N/A"}</p>
        <p>Total Payment Methods: {paymentMethods.length}</p>
      </div>

      <div>
        <h3>Audit Logs</h3>
        <p>Logs of payment method changes will appear here (To be implemented).</p>
      </div>
    </div>
  );
};

export default PaymentMethodsPage;
