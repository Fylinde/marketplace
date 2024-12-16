import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchTransactionDetails } from "../../../../redux/slices/orders/paymentSlice";
import { getLocalizedText, formatCurrency } from "../../../../utils/localizationUtils";
import type { AppDispatch } from "../../../../redux/store";

const TransactionDetails = () => {
  const { transactionId } = useParams<{ transactionId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { transaction, loading, error } = useSelector((state: any) => state.transaction);

  useEffect(() => {
    if (transactionId) {
      dispatch(fetchTransactionDetails(transactionId));
    }
  }, [dispatch, transactionId]);

  const handleRefundRequest = () => {
    // Refund logic here, potentially dispatching a refund action.
    alert(getLocalizedText("refundRequested", "transactions"));
  };

  if (loading) return <p>{getLocalizedText("loading", "common")}</p>;
  if (error) return <p>{getLocalizedText("error", "common", { error })}</p>;

  if (!transaction) return <p>{getLocalizedText("transactionNotFound", "transactions")}</p>;

  return (
    <div>
      <h2>{getLocalizedText("transactionDetails", "transactions")}</h2>
      <p>
        <strong>{getLocalizedText("transactionId", "transactions")}:</strong>{" "}
        {transaction.id}
      </p>
      <p>
        <strong>{getLocalizedText("amount", "transactions")}:</strong>{" "}
        {formatCurrency(transaction.amount, transaction.currency)}
      </p>
      <p>
        <strong>{getLocalizedText("timestamp", "transactions")}:</strong>{" "}
        {new Date(transaction.timestamp).toLocaleString()}
      </p>
      <p>
        <strong>{getLocalizedText("escrowStatus", "transactions")}:</strong>{" "}
        {getLocalizedText(transaction.escrowStatus, "transactions")}
      </p>
      {transaction.items && (
        <div>
          <h3>{getLocalizedText("items", "transactions")}</h3>
          <ul>
            {transaction.items.map((item: any) => (
              <li key={item.id}>
                <p>
                  <strong>{getLocalizedText("itemName", "transactions")}:</strong>{" "}
                  {item.name}
                </p>
                <p>
                  <strong>{getLocalizedText("itemPrice", "transactions")}:</strong>{" "}
                  {formatCurrency(item.price, transaction.currency)}
                </p>
                <p>
                  <strong>{getLocalizedText("quantity", "transactions")}:</strong> {item.quantity}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
      <button onClick={handleRefundRequest}>
        {getLocalizedText("requestRefund", "transactions")}
      </button>
    </div>
  );
};

export default TransactionDetails;
