import React, { useState } from "react";
import Box from "../Box";
import ProductFilterCard from "../ProductFilterCard"; // Import the detailed filter card
import Checkbox from "../Checkbox";
import RangeSlider from "../RangeSlider";
import Button from "../buttons/Button";
import FlexBox from "../FlexBox";
import { H6 } from "../Typography";
import { useAppDispatch, useAppSelector } from "../../redux/reduxHooks";
import { updateFilters, clearFilters, applyFilters } from "../../redux/slices/productFilterSlice";
import { getLocalizedText, formatCurrency } from "../../utils/localizationUtils";

const FilterPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const { filters } = useAppSelector((state) => state.productFilters);
  const { userContext, currency } = useAppSelector((state) => state.user);

  const [buyerPriceRange, setBuyerPriceRange] = useState<number[]>([0, 1000]);
  const [sellerPriceRange, setSellerPriceRange] = useState<number[]>([0, 1000]);

  const handleFilterChange = (filterType: string, value: any) => {
    dispatch(updateFilters({ filterType, value }));
  };

  const handleBuyerPriceChange = (range: number[]) => {
    setBuyerPriceRange(range);
    handleFilterChange("buyerPrice", range);
  };

  const handleSellerPriceChange = (range: number[]) => {
    setSellerPriceRange(range);
    handleFilterChange("sellerPrice", range);
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    setBuyerPriceRange([0, 1000]);
    setSellerPriceRange([0, 1000]);
  };

  const handleApplyFilters = () => {
    dispatch(applyFilters(filters)); // Apply the selected filters
  };

  return (
    <Box p="20px" border="1px solid #e0e0e0" borderRadius="8px">
      <H6 mb="1rem">{getLocalizedText("filters")}</H6>

      {/* Context Filters */}
      <Box mb="1rem">
        <H6>{getLocalizedText("businessModel")}</H6>
        <FlexBox flexDirection="column" mt="0.5rem">
          <Checkbox
            label={getLocalizedText("b2b")}
            checked={filters.context === "B2B"}
            onChange={() => handleFilterChange("context", "B2B")}
          />
          <Checkbox
            label={getLocalizedText("b2c")}
            checked={filters.context === "B2C"}
            onChange={() => handleFilterChange("context", "B2C")}
          />
          <Checkbox
            label={getLocalizedText("c2c")}
            checked={filters.context === "C2C"}
            onChange={() => handleFilterChange("context", "C2C")}
          />
        </FlexBox>
      </Box>

      {/* Buyer Price Range */}
      {(userContext === "B2B" || userContext === "B2C") && (
        <Box mb="1rem">
          <H6>{getLocalizedText("buyerPriceRange")}</H6>
          <RangeSlider
            min={0}
            max={1000}
            value={buyerPriceRange}
            onChange={handleBuyerPriceChange}
            step={10}
            label={buyerPriceRange.map((price) => formatCurrency(price, currency))}
          />
        </Box>
      )}

      {/* Seller Price Range */}
      {(userContext === "B2B" || userContext === "C2C") && (
        <Box mb="1rem">
          <H6>{getLocalizedText("sellerPriceRange")}</H6>
          <RangeSlider
            min={0}
            max={1000}
            value={sellerPriceRange}
            onChange={handleSellerPriceChange}
            step={10}
            label={sellerPriceRange.map((price) => formatCurrency(price, currency))}
          />
        </Box>
      )}

      {/* ProductFilterCard */}
      <ProductFilterCard />

      {/* Apply and Clear Buttons */}
      <FlexBox justifyContent="space-between" mt="2rem">
        <Button variant="outlined" onClick={handleClearFilters}>
          {getLocalizedText("clearFilters")}
        </Button>
        <Button variant="contained" onClick={handleApplyFilters}>
          {getLocalizedText("applyFilters")}
        </Button>
      </FlexBox>
    </Box>
  );
};

export default FilterPanel;
