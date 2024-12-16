import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFraudulentOrders,
  markOrderAsFraudulent,
  resolveFraudulentOrder,
} from "../../../redux/slices/analytics/fraudSlice";
import { getLocalizedText } from "../../../utils/localizationUtils";
import type { AppDispatch, RootState } from "../../../redux/store";

const FraudDetectionAndPrevention = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { fraudulentOrders, loading, error, insights } = useSelector(
    (state: RootState) => state.fraud
  );

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchFraudulentOrders());
  }, [dispatch]);

  const handleMarkAsFraudulent = async (orderId: string) => {
    try {
      await dispatch(markOrderAsFraudulent(orderId)).unwrap();
      alert(getLocalizedText("markedAsFraudulent", "fraudDetection"));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      alert(getLocalizedText("markFraudError", "fraudDetection", { error: errorMessage }));
    }
  };

  const handleResolveFraudulentOrder = async (orderId: string) => {
    try {
      await dispatch(resolveFraudulentOrder(orderId)).unwrap();
      alert(getLocalizedText("resolvedFraudulentOrder", "fraudDetection"));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      alert(getLocalizedText("resolveFraudError", "fraudDetection", { error: errorMessage }));
    }
  };

  const renderFraudInsights = () => (
    <div className="fraud-insights">
      <h3>{getLocalizedText("fraudInsights", "fraudDetection")}</h3>
      <ul>
        {insights.map((insight, index) => (
          <li key={index}>
            <strong>{insight.pattern}:</strong> {insight.count} cases
          </li>
        ))}
      </ul>
    </div>
  );

  const renderFraudulentOrderDetails = () => {
    const selectedOrder = fraudulentOrders.find((order) => order.id === selectedOrderId);
    if (!selectedOrder) return null;

    return (
      <div className="fraud-order-details">
        <h3>{getLocalizedText("orderDetails", "fraudDetection")}</h3>
        <p>
          <strong>{getLocalizedText("orderId", "common")}: </strong>
          {selectedOrder.id}
        </p>
        <p>
          <strong>{getLocalizedText("amount", "common")}: </strong>
          {selectedOrder.amount} {selectedOrder.currency}
        </p>
        <p>
          <strong>{getLocalizedText("riskLevel", "fraudDetection")}: </strong>
          {selectedOrder.riskLevel}
        </p>
        <p>
          <strong>{getLocalizedText("patterns", "fraudDetection")}: </strong>
          {selectedOrder.patterns.join(", ")}
        </p>
        <button onClick={() => handleResolveFraudulentOrder(selectedOrder.id)}>
          {getLocalizedText("resolveOrder", "fraudDetection")}
        </button>
      </div>
    );
  };

  const renderFraudulentOrdersList = () => (
    <div className="fraud-orders-list">
      <h3>{getLocalizedText("fraudulentOrders", "fraudDetection")}</h3>
      <ul>
        {fraudulentOrders.map((order) => (
          <li
            key={order.id}
            className={order.id === selectedOrderId ? "active" : ""}
            onClick={() => setSelectedOrderId(order.id)}
          >
            <p>
              <strong>{getLocalizedText("orderId", "common")}: </strong>
              {order.id}
            </p>
            <p>
              <strong>{getLocalizedText("riskLevel", "fraudDetection")}: </strong>
              {order.riskLevel}
            </p>
            <p>
              <strong>{getLocalizedText("amount", "common")}: </strong>
              {order.amount} {order.currency}
            </p>
            <button onClick={() => handleMarkAsFraudulent(order.id)}>
              {getLocalizedText("markAsFraudulent", "fraudDetection")}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );

  if (loading) return <p>{getLocalizedText("loading", "common")}</p>;
  if (error) {
    let errorMessage: string;

    if (typeof error === "string") {
      errorMessage = error; // Directly use the string if `error` is a string
    } else if (error && typeof error === "object" && "message" in error) {
      errorMessage = (error as Error).message; // Safely access the `message` property if it exists
    } else {
      errorMessage = "An unknown error occurred"; // Fallback for unexpected types
    }

    return (
      <p>
        {getLocalizedText("errorFetchingFraudOrders", "fraudDetection", { error: errorMessage })}
      </p>
    );
  }


  return (
    <div className="fraud-detection">
      <h1>{getLocalizedText("fraudDetection", "fraudDetection")}</h1>
      {renderFraudInsights()}
      <div className="fraud-container">
        {renderFraudulentOrdersList()}
        {renderFraudulentOrderDetails()}
      </div>
    </div>
  );
};

export default FraudDetectionAndPrevention;
