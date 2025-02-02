import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../../../redux/reduxHooks";
import { fetchTransactionHistory } from "../../../../redux/slices/orders/transactionSlice";
import styled from "styled-components";
import { Table, Spin, Alert, Input } from "antd";
import { getLocalizedText } from "utils/localizationUtils";
import type { AppDispatch, RootState } from "../../../../redux/store";

const HistoryPageContainer = styled.div`
  padding: 20px;

  h2 {
    margin-bottom: 20px;
  }

  .search-bar {
    margin-bottom: 20px;
  }
`;

interface Transaction {
  id: string;
  amount: number;
  status: string;
  date: string;
}

const TransactionHistoryPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { transactions, loading, error } = useAppSelector(
    (state: RootState) => state.transaction
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState<Transaction[]>([]);

  // Fetch transaction history (Assuming userId is required; replace with dynamic user ID)
  useEffect(() => {
    const userId = "123"; // Replace with the actual user ID
    dispatch(fetchTransactionHistory(userId));
  }, [dispatch]);

  // Filter transactions based on search term
  useEffect(() => {
    if (searchTerm) {
      setFilteredData(
        transactions.filter((transaction) =>
          transaction.id.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredData(transactions);
    }
  }, [searchTerm, transactions]);

  const columns = [
    {
      title: getLocalizedText("Transaction ID", "payment"),
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
  ];

  return (
    <HistoryPageContainer>
      <h2>{getLocalizedText("Transaction History", "payment")}</h2>

      <Input.Search
        className="search-bar"
        placeholder={getLocalizedText("Search transactions", "payment")}
        onChange={(e) => setSearchTerm(e.target.value)}
        allowClear
      />

      {loading && <Spin tip={getLocalizedText("Loading transaction history...", "payment")} />}
      {error && <Alert message={error} type="error" />}

      <Table
        dataSource={filteredData}
        columns={columns}
        rowKey={(record) => record.id}
        pagination={{ pageSize: 10 }}
        loading={loading}
      />
    </HistoryPageContainer>
  );
};

export default TransactionHistoryPage;
