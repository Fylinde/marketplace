import React, { useState } from "react";
import styled from "styled-components";
import Box from "components/Box";
import Table from "components/table/Table";
import Button from "components/buttons/Button";
import Chatbot from "components/chatbot/Chatbot";
import TryOnViewer from "@/components/TryOn/TryOnViewer";
import { useTranslation } from "react-i18next";

interface Return {
  id: string;
  product: string;
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
  currency: string;
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

  th, td {
    text-align: left;
    padding: 10px;
  }

  @media (max-width: 768px) {
    th, td {
      font-size: 14px;
    }
  }
`;

const ReturnProcessing: React.FC = () => {
  const { t } = useTranslation();

  const [returns, setReturns] = useState<Return[]>([
    {
      id: "1",
      product: "Laptop",
      reason: "Defective",
      status: "Pending",
      currency: "USD",
      buyerPrice: 1000,
      sellerPrice: 950,
      paymentType: "Fiat",
    },
    {
      id: "2",
      product: "Phone",
      reason: "Wrong Item Delivered",
      status: "Approved",
      currency: "EUR",
      buyerPrice: 800,
      sellerPrice: 760,
      paymentType: "Escrow",
    },
  ]);

  const updateStatus = (id: string, status: Return["status"]) => {
    setReturns((prev) =>
      prev.map((ret) => (ret.id === id ? { ...ret, status } : ret))
    );
  };

  return (
    <StyledBox>
      <h2>{t("returnProcessingTitle")}</h2>
      <Chatbot />
      <StyledTable>
        <thead>
          <tr>
            <th>{t("productColumn")}</th>
            <th>{t("reasonColumn")}</th>
            <th>{t("statusColumn")}</th>
            <th>{t("priceColumn")}</th>
            <th>{t("paymentTypeColumn")}</th>
            <th>{t("actionsColumn")}</th>
          </tr>
        </thead>
        <tbody>
          {returns.map((ret) => (
            <tr key={ret.id}>
              <td>
                {ret.product}
                <TryOnViewer productId={ret.id} />
              </td>
              <td>{ret.reason}</td>
              <td>{t(ret.status.toLowerCase())}</td>
              <td>
                {t("buyerPrice")}: {ret.currency} {ret.buyerPrice.toFixed(2)} <br />
                {t("sellerPrice")}: {ret.currency} {ret.sellerPrice.toFixed(2)}
              </td>
              <td>{t(ret.paymentType.toLowerCase())}</td>
              <td>
                {ret.status === "Pending" && (
                  <>
                    <Button onClick={() => updateStatus(ret.id, "Approved")}>
                      {t("approveButton")}
                    </Button>
                    <Button onClick={() => updateStatus(ret.id, "Rejected")}>
                      {t("rejectButton")}
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
