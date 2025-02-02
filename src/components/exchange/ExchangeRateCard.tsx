import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCurrentExchangeRates } from "../../redux/slices/utils/exchangeRateSlice";
import { RootState } from "../../redux/store";
import { Card, RateList, RateItem } from "./Styles/StyledExchangeRateCard"; // Assuming styles are imported from styled-components



interface ExchangeRateCardProps {
  rates: Record<string, number>;
  baseCurrency: string;
}

const ExchangeRateCard: React.FC<ExchangeRateCardProps> = ({ rates, baseCurrency }) => {
  const dispatch = useDispatch();
  const { currentRates, loading, error } = useSelector(
    (state: RootState) => state.exchangeRate
  );

  useEffect(() => {
    dispatch(fetchCurrentExchangeRates() as any); // Ensure typing compatibility
  }, [dispatch]);

  if (loading) return <Card>Loading exchange rates...</Card>;
  if (error) return <Card>Error fetching exchange rates: {error}</Card>;
  if (!currentRates) return <Card>No exchange rates available.</Card>;

  const { updatedAt } = currentRates;

  return (
    <Card>
      <h4>Exchange Rates</h4>
      <p>Base Currency: <span>{baseCurrency}</span></p>
      <p>Last Updated: <span>{new Date(updatedAt).toLocaleString()}</span></p>

      <RateList>
        {Object.entries(rates).map(([currency, rate]) => (
          <RateItem key={currency}>
            <strong>{currency}:</strong> {rate.toFixed(2)} {/* Ensure that 'rate' is typed correctly */}
          </RateItem>
        ))}
      </RateList>
    </Card>
  );
};

export default ExchangeRateCard;
