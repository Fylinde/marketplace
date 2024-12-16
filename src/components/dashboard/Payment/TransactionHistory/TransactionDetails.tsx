import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/reduxHooks";
import { fetchTransactionDetails } from "@/redux/slices/orders/transactionSlice";
import styled from "styled-components";
import { Spin, Alert, Card } from "antd";
import { useParams } from "react-router-dom";
import { getLocalizedText } from "utils/localizationUtils";

const TransactionDetailsContainer = styled.div`
  padding: 20px;

  .transaction-card {
    margin: 20px 0;
  }

  h2 {
    margin-bottom: 20px;
  }
`;

interface TransactionDetailsProps {
  transactionId: string;
}

const TransactionDetails: React.FC<TransactionDetailsProps> = ({ transactionId }) => {
  const dispatch = useAppDispatch();
  // const { transactionId } = useParams<{ transactionId: string }>();
  const { details, loading, error } = useAppSelector((state) => state.transaction);

  useEffect(() => {
    if (transactionId) {
      dispatch(fetchTransactionDetails(transactionId));
    }
  }, [dispatch, transactionId]);

  return (
    <TransactionDetailsContainer>
      <h2>{getLocalizedText("Transaction Details", "payment")}</h2>
      {loading && <Spin tip={getLocalizedText("Loading transaction details...", "payment")} />}
      {error && <Alert message={error} type="error" />}
      {details && (
        <Card className="transaction-card" title={getLocalizedText("Transaction Information", "payment")}>
          <p>
            <strong>{getLocalizedText("Transaction ID", "payment")}:</strong> {details.id}
          </p>
          <p>
            <strong>{getLocalizedText("Amount", "payment")}:</strong> ${details.amount}
          </p>
          <p>
            <strong>{getLocalizedText("Status", "payment")}:</strong> {details.status}
          </p>
          <p>
            <strong>{getLocalizedText("Date", "payment")}:</strong> {details.date}
          </p>
          <p>
            <strong>{getLocalizedText("Buyer", "payment")}:</strong> {details.buyer}
          </p>
          <p>
            <strong>{getLocalizedText("Seller", "payment")}:</strong> {details.seller}
          </p>
          <p>
            <strong>{getLocalizedText("Description", "payment")}:</strong> {details.description}
          </p>
        </Card>
      )}
    </TransactionDetailsContainer>
  );
};

export default TransactionDetails;
