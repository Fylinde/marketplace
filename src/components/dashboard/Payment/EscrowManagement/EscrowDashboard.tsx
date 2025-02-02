import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEscrowTransactions } from "../../../../redux/slices/orders/escrowSlice";
import EscrowAnalytics from "./EscrowAnalytics";
import PerformanceMetrics from "./PerformanceMetrics";
import EscrowNotificationSystem from "./EscrowNotificationSystem";
import type { AppDispatch } from "../../../../redux/store";

const EscrowDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { transactions, loading, error } = useSelector((state: any) => state.escrow);

  useEffect(() => {
    dispatch(fetchEscrowTransactions());
  }, [dispatch]);

  if (loading) return <p>Loading escrow transactions...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <EscrowNotificationSystem />
      <h2>Escrow Dashboard</h2>
      <table>
        <thead>
          <tr>
            <th>Transaction ID</th>
            <th>Buyer</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction: any) => (
            <tr key={transaction.id}>
              <td>{transaction.id}</td>
              <td>{transaction.buyerName}</td>
              <td>
                {transaction.amount} {transaction.currency}
              </td>
              <td>{transaction.status}</td>
              <td>
                {/* Action buttons for releasing funds or initiating disputes */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <EscrowAnalytics />
      <PerformanceMetrics />
    </div>
  );
};

export default EscrowDashboard;
