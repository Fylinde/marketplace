import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRefundStatuses } from "../../../../redux/slices/orders/paymentSlice";
import { getLocalizedText, formatCurrency } from "../../../../utils/localizationUtils";
import type { AppDispatch } from "../../../../redux/store";

const RefundStatusPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { refundStatuses, loading, error } = useSelector((state: any) => state.refund);

  useEffect(() => {
    dispatch(fetchRefundStatuses());
  }, [dispatch]);

  const [expandedRefundId, setExpandedRefundId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedRefundId(expandedRefundId === id ? null : id);
  };

  if (loading) return <p>{getLocalizedText("loading", "returnAndRefund")}</p>;
  if (error) return <p>{getLocalizedText("errorFetchingOrder", "returnAndRefund")}</p>;

  return (
    <div>
      <h2>{getLocalizedText("returnAndRefundTitle", "returnAndRefund")}</h2>
      <ul>
        {refundStatuses.map((refund: any) => (
          <li key={refund.id}>
            <div className="refund-summary">
              <strong>
                {getLocalizedText("orderID", "returnAndRefund")}: {refund.orderId}
              </strong>{" "}
              - {refund.status === "processed"
                ? getLocalizedText("refundProcessed", "returnAndRefund")
                : getLocalizedText("refundError", "returnAndRefund")}
              <button onClick={() => toggleExpand(refund.id)}>
                {expandedRefundId === refund.id
                  ? getLocalizedText("collapse", "returnAndRefund")
                  : getLocalizedText("viewDetails", "returnAndRefund")}
              </button>
            </div>
            {expandedRefundId === refund.id && (
              <div className="refund-details">
                <p>
                  <strong>{getLocalizedText("refundReason", "returnAndRefund")}:</strong>{" "}
                  {refund.reason || getLocalizedText("orderNotAvailable", "returnAndRefund")}
                </p>
                <p>
                  <strong>{getLocalizedText("timeline", "returnAndRefund")}:</strong>{" "}
                  {refund.estimatedResolution
                    ? `${refund.estimatedResolution} ${getLocalizedText("days", "returnAndRefund")}`
                    : getLocalizedText("noEstimate", "returnAndRefund")}
                </p>
                <p>
                  <strong>{getLocalizedText("refundAmount", "returnAndRefund")}:</strong>{" "}
                  {formatCurrency(refund.amount, refund.currency)}
                </p>
                {refund.additionalNotes && (
                  <p>
                    <strong>{getLocalizedText("notes", "returnAndRefund")}:</strong>{" "}
                    {refund.additionalNotes}
                  </p>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RefundStatusPage;
