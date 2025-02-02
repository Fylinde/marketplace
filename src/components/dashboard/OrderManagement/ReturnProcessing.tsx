import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Box from "../../../components/Box";
import Table from "../../../components/table/Table";
import Button from "../../../components/buttons/Button";
import Chatbot from "../../../components/chatbot/Chatbot";
import TryOnViewer from "../../../components/TryOn/TryOnViewer";
import { getLocalizedText, formatCurrency } from "../../../utils/localizationUtils";

interface Return {
  id: string;
  product: string;
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
  buyerCurrency: string;
  sellerCurrency: string;
  buyerPrice: number;
  sellerPrice: number;
  paymentType: "Fiat" | "Crypto" | "Escrow";
}

const StyledBox = styled(Box)`
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  max-width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (max-width: 768px) {
    padding: 15px;
  }
`;

const StyledTable = styled(Table)`
  width: 100%;
  margin-top: 20px;

  th,
  td {
    text-align: left;
    padding: 10px;
  }

  @media (max-width: 768px) {
    th,
    td {
      font-size: 14px;
    }
  }
`;

const ReturnProcessing: React.FC = () => {
  const [returns, setReturns] = useState<Return[]>([]);
  const [openModalId, setOpenModalId] = useState<number | null>(null);

  // Fetch returns dynamically
  useEffect(() => {
    const fetchReturns = async () => {
      // Replace with actual API call
      const fetchedReturns: Return[] = [
        {
          id: "1",
          product: "Laptop",
          reason: "Defective",
          status: "Pending",
          buyerCurrency: "USD",
          sellerCurrency: "EUR",
          buyerPrice: 1000,
          sellerPrice: 950,
          paymentType: "Fiat",
        },
        {
          id: "2",
          product: "Phone",
          reason: "Wrong Item Delivered",
          status: "Approved",
          buyerCurrency: "USD",
          sellerCurrency: "EUR",
          buyerPrice: 800,
          sellerPrice: 760,
          paymentType: "Escrow",
        },
      ];
      setReturns(fetchedReturns);
    };

    fetchReturns();
  }, []);

  const updateStatus = (id: string, status: Return["status"]) => {
    setReturns((prev) =>
      prev.map((ret) => (ret.id === id ? { ...ret, status } : ret))
    );
  };

  return (
    <StyledBox>
      <h2>{getLocalizedText("returnProcessingTitle", "returnAndRefund")}</h2>
      <Chatbot sessionId="12345" />
      <StyledTable>
        <thead>
          <tr>
            <th>{getLocalizedText("productColumn", "returnAndRefund")}</th>
            <th>{getLocalizedText("reasonColumn", "returnAndRefund")}</th>
            <th>{getLocalizedText("statusColumn", "returnAndRefund")}</th>
            <th>{getLocalizedText("priceColumn", "returnAndRefund")}</th>
            <th>{getLocalizedText("paymentTypeColumn", "returnAndRefund")}</th>
            <th>{getLocalizedText("actionsColumn", "returnAndRefund")}</th>
          </tr>
        </thead>
        <tbody>
          {returns.map((ret) => (
            <tr key={ret.id}>
              <td>
                {ret.product}
                <TryOnViewer
                  productId={Number(ret.id)}
                  isOpen={openModalId === Number(ret.id)}
                  onClose={() => setOpenModalId(null)}
                  fetchAsset={() =>
                    new Promise((resolve) => {
                      console.log(`Fetching asset for product ID: ${ret.id}`);
                      resolve(`Asset for product ID: ${ret.id}`);
                    })
                  }
                />
                <Button onClick={() => setOpenModalId(Number(ret.id))}>
                  {getLocalizedText("viewProduct", "returnAndRefund")}
                </Button>
              </td>
              <td>{ret.reason}</td>
              <td>{getLocalizedText(ret.status.toLowerCase(), "returnAndRefund")}</td>
              <td>
                {getLocalizedText("buyerPrice", "returnAndRefund")}: {formatCurrency(ret.buyerPrice, ret.buyerCurrency)} <br />
                {getLocalizedText("sellerPrice", "returnAndRefund")}: {formatCurrency(ret.sellerPrice, ret.sellerCurrency)}
              </td>
              <td>{getLocalizedText(ret.paymentType.toLowerCase(), "returnAndRefund")}</td>
              <td>
                {ret.status === "Pending" && (
                  <>
                    <Button onClick={() => updateStatus(ret.id, "Approved")}>
                      {getLocalizedText("approveButton", "returnAndRefund")}
                    </Button>
                    <Button onClick={() => updateStatus(ret.id, "Rejected")}>
                      {getLocalizedText("rejectButton", "returnAndRefund")}
                    </Button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </StyledTable>
    </StyledBox>
  );
};

export default ReturnProcessing;
