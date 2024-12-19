import React, { useState } from "react";
import { useAppSelector, useAppDispatch } from "../redux/reduxHooks";
import { formatCurrency, getLocalizedText } from "../utils/localizationUtils";
import shippingCalculator from "../utils/shippingCalculator";
import countryList from "../data/countryList";
import Select from "../components/Select";
import TextField from "../components/text-field/TextField";
import Button from "../components/buttons/Button";
import Divider from "../components/Divider";
import Typography from "../components/Typography";

const Checkout = () => {
  const dispatch = useAppDispatch();
  const { cartList, totalBuyerPrice, currency } = useAppSelector((state) => state.cart);

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
          label: country.name,
          value: country.code,
        }))}
        onChange={(option) => setSelectedCountry(option.value)}
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
            {formatCurrency(shippingCost, currency)}
          </Typography>
          <Typography>
            {getLocalizedText("estimatedDelivery", "shipping")}: {estimatedDelivery}
          </Typography>
          <Typography>
            {getLocalizedText("taxes", "shipping")}: {formatCurrency(taxes, currency)}
          </Typography>
        </div>
      )}

      <Divider my="1.5rem" />
    </div>
  );
};

export default Checkout;
