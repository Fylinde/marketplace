import React, { useState } from "react";
import { useAppSelector, useAppDispatch } from "../redux/reduxHooks";
import { getLocalizedText } from "../utils/localizationUtils";
import { convertCurrency } from "../utils/currencyConversion"; // Assuming this is the utility for currency conversion
import shippingCalculator from "../utils/shippingCalculator";
import Select from "../components/Select";
import TextField from "../components/text-field/TextField";
import Button from "../components/buttons/Button";
import Divider from "../components/Divider";
import Typography from "../components/Typography";
import { countryList } from "../data/countryList";
import { SelectOption } from "../types/selectOption";
import { ExchangeRate } from "../types/ExchangeRate";

const Checkout = () => {
  const dispatch = useAppDispatch();
  const {
    cartList,
    totalBuyerPrice,
    buyerCurrency: buyerCurrencyState,
    sellerCurrency: sellerCurrencyState,
    exchangeRate,
  } = useAppSelector((state) => state.cart);

  // Fallback to default currencies if undefined
  const buyerCurrency = buyerCurrencyState || "USD";
  const sellerCurrency = sellerCurrencyState || "USD";

  // Ensure the correct `ExchangeRate` object is used
  const currentExchangeRate: ExchangeRate | null = 
    Array.isArray(exchangeRate) && exchangeRate.length > 0
      ? exchangeRate[0]
      : null;

  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedState, setSelectedState] = useState<string>("");
  const [postalCode, setPostalCode] = useState<string>("");
  const [shippingCost, setShippingCost] = useState<number>(0);
  const [estimatedDelivery, setEstimatedDelivery] = useState<string>("");
  const [taxes, setTaxes] = useState<number>(0);

  const handleShippingCalculation = async () => {
    try {
      const result = await shippingCalculator.calculateShipping({
        methodId: "standard",
        address: {
          country: selectedCountry,
          state: selectedState,
          city: "",
          postalCode,
        },
        cartTotal: totalBuyerPrice,
      });

      setShippingCost(result.shippingCost);
      setEstimatedDelivery(result.estimatedDelivery);
      setTaxes(result.taxes || 0);
    } catch (error) {
      console.error("Shipping calculation failed:", error);
    }
  };

  return (
    <div>
      <Typography fontWeight="600" mb="1rem">
        {getLocalizedText("shippingEstimates", "shipping")}
      </Typography>

      {/* Country Selector */}
      <Select
        label={getLocalizedText("country", "shipping")}
        options={countryList.map((country) => ({
          label: country.label,
          value: country.value,
        }))}
        isMulti={false}
        onChange={(option) => {
          if (option && !Array.isArray(option) && "value" in option) {
            setSelectedCountry(option.value);
          }
        }}
        mb="1rem"
      />

      {/* State Selector */}
      <TextField
        label={getLocalizedText("state", "shipping")}
        placeholder={getLocalizedText("enterState", "shipping")}
        value={selectedState}
        onChange={(e) => setSelectedState(e.target.value)}
        fullwidth
        mb="1rem"
      />

      {/* Postal Code */}
      <TextField
        label={getLocalizedText("zipCode", "shipping")}
        placeholder="12345"
        value={postalCode}
        onChange={(e) => setPostalCode(e.target.value)}
        fullwidth
        mb="1rem"
      />

      <Button
        variant="outlined"
        color="primary"
        onClick={handleShippingCalculation}
        fullwidth
        mb="1rem"
      >
        {getLocalizedText("calculateShipping", "shipping")}
      </Button>

      {/* Display Shipping Cost */}
      {shippingCost > 0 && (
        <div>
          <Typography>
            {getLocalizedText("shippingCost", "shipping")}:{" "}
            {convertCurrency(
              shippingCost,
              sellerCurrency,
              buyerCurrency,
              currentExchangeRate
            )}
          </Typography>
          <Typography>
            {getLocalizedText("estimatedDelivery", "shipping")}: {estimatedDelivery}
          </Typography>
          <Typography>
            {getLocalizedText("taxes", "shipping")}:{" "}
            {convertCurrency(
              taxes,
              sellerCurrency,
              buyerCurrency,
              currentExchangeRate
            )}
          </Typography>
        </div>
      )}

      <Divider my="1.5rem" />

      {/* Cart Items */}
      <Typography fontWeight="600" mb="1rem">
        {getLocalizedText("cartSummary", "checkout")}
      </Typography>
      {cartList.map((item, index) => (
        <div key={index}>
          <Typography>
            {item.name}:{" "}
            {convertCurrency(
              item.sellerPrice,
              sellerCurrency,
              buyerCurrency,
              currentExchangeRate
            )}{" "}
            x {item.quantity}
          </Typography>
        </div>
      ))}
    </div>
  );
};

export default Checkout;
