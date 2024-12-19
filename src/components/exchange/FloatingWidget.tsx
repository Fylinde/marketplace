import React, { useState } from "react";
import ExchangeRateCard from "../../components/exchange/ExchangeRateCard";
import CurrencyConverter from "../../components/exchange/CurrencyConverter";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";


const FloatingWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { rates, baseCurrency } = useSelector((state: RootState) => state.exchangeRate);

  return (
    <div style={{ position: "fixed", bottom: "20px", right: "20px", zIndex: 1000 }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          backgroundColor: "#007bff",
          color: "#fff",
          padding: "10px 20px",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        {isOpen ? "Close Rates" : "Open Rates"}
      </button>
      {isOpen && (
        <div
          style={{
            marginTop: "10px",
            padding: "20px",
            backgroundColor: "#fff",
            borderRadius: "8px",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            width: "300px",
          }}
        >
        <h2>Exchange Rates</h2>
        <ExchangeRateCard rates={rates || {}} baseCurrency={baseCurrency || "USD"} />
        <h2>Currency Converter</h2>
        <CurrencyConverter rates={rates || {}} baseCurrency={baseCurrency || "USD"} />
        </div>
      )}
    </div>
  );
};

export default FloatingWidget;
