import React, { useState } from "react";
import Box from "../components/Box";
import ProductFilterCard from "../components/products/ProductFilterCard";
import CheckBox from "./CheckBox";
import RangeSlider from "./RangeSlider";
import Button from "./buttons/Button";
import FlexBox from "./FlexBox";
import { H6 } from "./Typography";
import { useAppDispatch, useAppSelector } from "../redux/reduxHooks";
import { updateFilters, clearFilters, applyFilters } from "../redux/slices/products/productFilterSlice";
import { getLocalizedText, formatCurrency } from "../utils/localizationUtils";
import { ProductFilters } from "../types/Product";

const FilterPanel: React.FC = () => {
  const dispatch = useAppDispatch();

  // Redux Selectors with Fallbacks
  const filters: ProductFilters = useAppSelector((state) => ({
    context: (state.filters?.filters?.context as "B2B" | "B2C" | "C2C" | null) || null,
    buyerPrice: (state.filters?.filters?.buyerPrice as [number, number]) || [0, 1000],
    sellerPrice: (state.filters?.filters?.sellerPrice as [number, number]) || [0, 1000],
    availability: (state.filters?.filters?.availability as "inStock" | "outOfStock" | null) || null,
    selectedCategories: state.filters?.filters?.selectedCategories || [],
  }));

  const userContext = useAppSelector((state) => state.user?.userContext || "B2B"); // Default to "B2B"
  const currency = useAppSelector((state) => state.user?.currency || "USD"); // Default to "USD"

  const [buyerPriceRange, setBuyerPriceRange] = useState<[number, number]>([0, 1000]);
  const [sellerPriceRange, setSellerPriceRange] = useState<[number, number]>([0, 1000]);
  
  const handleFilterChange = (filterType: keyof ProductFilters, value: any) => {
    dispatch(updateFilters({ filterType, value } as { filterType: keyof ProductFilters; value: any }));
  };

 const handleBuyerPriceChange = (range: [number, number]) => {
  setBuyerPriceRange(range);
  handleFilterChange("buyerPrice", range);
};

const handleSellerPriceChange = (range: [number, number]) => {
  setSellerPriceRange(range);
  handleFilterChange("sellerPrice", range);
};

  const handleClearFilters = () => {
    dispatch(clearFilters());
    setBuyerPriceRange([0, 1000]);
    setSellerPriceRange([0, 1000]);
  };

  const handleApplyFilters = () => {
    dispatch(
      applyFilters({
        ...filters,
        context: filters.context || null,
        buyerPrice: filters.buyerPrice || [0, 1000],
        sellerPrice: filters.sellerPrice || [0, 1000],
        availability: filters.availability || null,
        selectedCategories: filters.selectedCategories || [],
      })
    );
  };
  

  return (
    <Box p="20px" border="1px solid #e0e0e0" borderRadius="8px">
      <H6 mb="1rem">{getLocalizedText("filters", "filters")}</H6>

      {/* Context Filters */}
      <Box mb="1rem">
        <H6>{getLocalizedText("businessModel", "filters")}</H6>
        <FlexBox flexDirection="column" mt="0.5rem">
          <CheckBox
            label={getLocalizedText("b2b", "filters")}
            checked={filters.context === "B2B"}
            onChange={() => handleFilterChange("context", "B2B")}
          />
          <CheckBox
            label={getLocalizedText("b2c", "filters")}
            checked={filters.context === "B2C"}
            onChange={() => handleFilterChange("context", "B2C")}
          />
          <CheckBox
            label={getLocalizedText("c2c", "filters")}
            checked={filters.context === "C2C"}
            onChange={() => handleFilterChange("context", "C2C")}
          />
        </FlexBox>
      </Box>

      {/* Buyer Price Range */}
      {(userContext === "B2B" || userContext === "B2C") && (
        <Box mb="1rem">
          <H6>{getLocalizedText("buyerPriceRange", "filters")}</H6>
          <RangeSlider
            min={0}
            max={1000}
            value={buyerPriceRange}
            onChange={(range) => handleBuyerPriceChange([range[0], range[1]] as [number, number])}
            step={10}
            label={buyerPriceRange.map((price) => formatCurrency(price, currency))}
          />

        </Box>
      )}

      {/* Seller Price Range */}
      {(userContext === "B2B" || userContext === "C2C") && (
        <Box mb="1rem">
          <H6>{getLocalizedText("sellerPriceRange", "filters")}</H6>
          <RangeSlider
            min={0}
            max={1000}
            value={sellerPriceRange}
            onChange={(range) => handleSellerPriceChange([range[0], range[1]] as [number, number])}
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
          {getLocalizedText("clearFilters", "filters")}
        </Button>
        <Button variant="contained" onClick={handleApplyFilters}>
          {getLocalizedText("applyFilters", "filters")}
        </Button>
      </FlexBox>
    </Box>
  );
};

export default FilterPanel;
