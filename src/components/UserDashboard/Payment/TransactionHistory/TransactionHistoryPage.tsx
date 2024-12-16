import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTransactionHistory } from "../../../../redux/slices/orders/paymentSlice";
import { getLocalizedText, formatCurrency } from "../../../../utils/localizationUtils";
import { useNavigate } from "react-router-dom";
import type { AppDispatch } from "../../../../redux/store";

const TransactionHistoryPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { transactions, loading, error } = useSelector((state: any) => state.transaction);

  useEffect(() => {
    dispatch(fetchTransactionHistory());
  }, [dispatch]);

  const handleViewDetails = (transactionId: string) => {
    navigate(`/transactions/${transactionId}`);
  };

  if (loading) return <p>{getLocalizedText("loading", "common")}</p>;
  if (error) return <p>{getLocalizedText("error", "common", { error })}</p>;

  return (
    <div>
      <h2>{getLocalizedText("transactionHistory", "transactions")}</h2>
      <ul>
        {transactions.map((transaction: any) => (
          <li key={transaction.id} className="transaction-summary">
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
            <button onClick={() => handleViewDetails(transaction.id)}>
              {getLocalizedText("viewDetails", "common")}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionHistoryPage;
