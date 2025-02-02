import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { convertCurrency } from "../../redux/slices/utils/exchangeRateSlice";
import { RootState } from "../../redux/store";
import {
  ConverterContainer,
  ConverterForm,
  Input,
  Select,
  Button,
  ErrorText,
  ResultText
} from "./Styles/StyledCurrencyConverter";


interface CurrencyConverterProps {
  rates: Record<string, number>;
  baseCurrency: string;
}


const CurrencyConverter: React.FC<CurrencyConverterProps> = ({ rates, baseCurrency }) => {
  const [amount, setAmount] = useState(0);
  const [fromCurrency, setFromCurrency] = useState(baseCurrency || "USD");
  const [toCurrency, setToCurrency] = useState("EUR");

  const calculateConversion = () => {
    const fromRate = rates[fromCurrency] || 1; // Default to 1 if rate is unavailable
    const toRate = rates[toCurrency] || 1; // Default to 1 if rate is unavailable
    return (amount / fromRate) * toRate;
  };

  const handleConvert = () => {
    const result = calculateConversion();
    alert(`${amount} ${fromCurrency} = ${result.toFixed(2)} ${toCurrency}`);
  };

  return (
    <ConverterContainer>
      <h4>Currency Converter</h4>
      <ConverterForm>
        <Input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          placeholder="Enter amount"
        />
        <Select
          value={fromCurrency}
          onChange={(e) => setFromCurrency(e.target.value)}
        >
          {Object.keys(rates).map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </Select>
        <Select
          value={toCurrency}
          onChange={(e) => setToCurrency(e.target.value)}
        >
          {Object.keys(rates).map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </Select>
        <Button onClick={handleConvert}>Convert</Button>
      </ConverterForm>

      <ResultText>
        {amount} {fromCurrency} = {calculateConversion().toFixed(2)} {toCurrency}
      </ResultText>
    </ConverterContainer>
  );
};


export default CurrencyConverter;
