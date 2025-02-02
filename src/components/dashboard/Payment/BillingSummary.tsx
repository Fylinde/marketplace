import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/reduxHooks";
import { fetchBillingSummary } from "../../../redux/slices/orders/billingSlice";
import styled from "styled-components";
import { Card, Spin, Alert } from "antd";
import { getLocalizedText } from "../../../utils/localizationUtils";

const SummaryContainer = styled.div`
  padding: 20px;

  .summary-card {
    margin-bottom: 20px;
  }

  h2 {
    margin-bottom: 20px;
  }
`;

const BillingSummary: React.FC = () => {
  const dispatch = useAppDispatch();
  const { billingSummary, loading, error } = useAppSelector((state) => state.billing);

  useEffect(() => {
    dispatch(fetchBillingSummary());
  }, [dispatch]);

  return (
    <SummaryContainer>
      <h2>{getLocalizedText("Billing Summary", "payment")}</h2>

      {loading && <Spin tip={getLocalizedText("Loading billing summary...", "payment")} />}
      {error && <Alert message={error} type="error" />}

      {billingSummary && (
        <>
          <Card className="summary-card" title={getLocalizedText("Total Revenue", "payment")}>
            <p>{getLocalizedText("Amount", "payment")}: ${billingSummary.totalBilled.toFixed(2)}</p>
          </Card>

          <Card className="summary-card" title={getLocalizedText("Outstanding Payments", "payment")}>
            <p>{getLocalizedText("Amount", "payment")}: ${billingSummary.pendingInvoices.toFixed(2)}</p>
          </Card>

          <Card className="summary-card" title={getLocalizedText("Last Payment Date", "payment")}>
            <p>{getLocalizedText("Date", "payment")}: {billingSummary.lastBillingDate}</p>
          </Card>
        </>
      )}
    </SummaryContainer>
  );
};

export default BillingSummary;
