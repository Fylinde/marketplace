import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchEscrowTransactions,
  fetchDisputeInfo,
  fetchTimeline,
} from "../../../../redux/slices/orders/escrowSlice";
import { getLocalizedText } from "../../../../utils/localizationUtils";
import EscrowTimeline from "./EscrowTimeline";
import DeliveryTimeline from "./DeliveryTimeline";
import Notifications from "./Notifications";
import type { AppDispatch } from "../../../../redux/store";


const UserEscrowDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { transactions, loading, error } = useSelector((state: any) => state.escrow);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [deliveryTimeline, setDeliveryTimeline] = useState<any[]>([]);

  useEffect(() => {
    dispatch(fetchEscrowTransactions());
  }, [dispatch]);

  const handleViewDetails = async (transaction: any) => {
    setSelectedTransaction(transaction);

    // Fetch delivery timeline
    try {
      const timeline = await dispatch(fetchTimeline(transaction.id)).unwrap();
      setDeliveryTimeline(timeline);
    } catch (err) {
      if (err instanceof Error) {
        alert(getLocalizedText("deliveryTimelineError", "escrow", { error: err.message }));
      } else {
        alert(getLocalizedText("unknownError", "escrow"));
      }
    }
  };


  if (loading) return <p>{getLocalizedText("loading", "common")}</p>;
  if (error) return <p>{getLocalizedText("error", "common", { error })}</p>;

  return (
    <div>
      <Notifications />
      <h2>{getLocalizedText("escrowDashboard", "escrow")}</h2>
      <table>
        <thead>
          <tr>
            <th>{getLocalizedText("transactionId", "escrow")}</th>
            <th>{getLocalizedText("amount", "escrow")}</th>
            <th>{getLocalizedText("status", "escrow")}</th>
            <th>{getLocalizedText("actions", "escrow")}</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction: any) => (
            <tr key={transaction.id}>
              <td>{transaction.id}</td>
              <td>
                {transaction.amount} {transaction.currency}
              </td>
              <td>{transaction.status}</td>
              <td>
                <button onClick={() => handleViewDetails(transaction)}>
                  {getLocalizedText("viewDetails", "escrow")}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedTransaction && (
        <div>
          <h3>{getLocalizedText("transactionDetails", "escrow")}</h3>
          <EscrowTimeline transaction={selectedTransaction} />
          <DeliveryTimeline timeline={deliveryTimeline} />
        </div>
      )}
    </div>
  );
};

export default UserEscrowDashboard;
