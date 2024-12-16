import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/reduxHooks";
import { fetchPaymentHistory } from "../../../redux/slices/orders/paymentSlice";
import styled from "styled-components";
import { Table, Spin, Alert } from "antd";
import { getLocalizedText } from "../../../utils/localizationUtils";

const HistoryContainer = styled.div`
  padding: 20px;

  h2 {
    margin-bottom: 20px;
  }
`;

const PaymentHistory: React.FC = () => {
  const dispatch = useAppDispatch();
  const { history, loading, error } = useAppSelector((state) => state.payments);

  useEffect(() => {
    dispatch(fetchPaymentHistory());
  }, [dispatch]);

  const columns = [
    {
      title: getLocalizedText("Payment ID", "payment"),
      dataIndex: "id",
      key: "id",
    },
    {
      title: getLocalizedText("Amount", "payment"),
      dataIndex: "amount",
      key: "amount",
      render: (text: number) => `$${text.toFixed(2)}`,
    },
    {
      title: getLocalizedText("Status", "payment"),
      dataIndex: "status",
      key: "status",
    },
    {
      title: getLocalizedText("Date", "payment"),
      dataIndex: "date",
      key: "date",
    },
    {
      title: getLocalizedText("Method", "payment"),
      dataIndex: "method",
      key: "method",
    },
  ];

  return (
    <HistoryContainer>
      <h2>{getLocalizedText("Payment History", "payment")}</h2>

      {loading && <Spin tip={getLocalizedText("Loading payment history...", "payment")} />}
      {error && <Alert message={error} type="error" />}

      <Table
        dataSource={history}
        columns={columns}
        rowKey={(record) => record.id}
        pagination={{ pageSize: 10 }}
        loading={loading}
      />
    </HistoryContainer>
  );
};

export default PaymentHistory;
