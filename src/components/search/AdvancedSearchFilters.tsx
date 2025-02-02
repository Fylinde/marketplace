import React, { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { setFilters, fetchSearchResults } from "../../redux/slices/utils/searchSlice";
import { debounce } from "../../utils/debounce";
import Box from "../Box";
import FlexBox from "../FlexBox";
import Slider from "@mui/material/Slider"; // Replace with a compatible slider component
import CheckBox from "../CheckBox";
import Button from "../buttons/Button";
import StyledFilters from "./StyledFilters";
import type { AppDispatch } from "../../redux/store";


interface AdvancedSearchFiltersProps {
  filters: Record<string, string>;
  onFilterChange: (newFilters: Record<string, string>) => void;
}

const AdvancedSearchFilters: React.FC<AdvancedSearchFiltersProps> = ({ filters, onFilterChange }) => {
  const dispatch = useDispatch<AppDispatch>();

  // State for filters
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<number | null>(null);

  // Categories, brands, and ratings options
  const categories = ["Electronics", "Fashion", "Home", "Automotive", "Books"];
  const brands = ["Brand A", "Brand B", "Brand C", "Brand D"];
  const ratings = [5, 4, 3, 2, 1];

  // Debounced dispatch for updating filters
  const updateFilters = useCallback(
    debounce((filters: Record<string, any>) => {
      dispatch(setFilters(filters));
      dispatch(fetchSearchResults({ query: "", page: 1, filters })); // Provide the page parameter


    }, 300),
    [dispatch]
  );

  // Handle price range change
  const handlePriceChange = (event: Event, value: number | number[]) => {
    const range = value as [number, number];
    setPriceRange(range);
    updateFilters({ priceRange: range });
  };

  // Handle category selection
  const toggleCategory = (category: string) => {
    const updatedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((cat) => cat !== category)
      : [...selectedCategories, category];
    setSelectedCategories(updatedCategories);
    updateFilters({ categories: updatedCategories });
  };

  // Handle brand selection
  const toggleBrand = (brand: string) => {
    const updatedBrands = selectedBrands.includes(brand)
      ? selectedBrands.filter((b) => b !== brand)
      : [...selectedBrands, brand];
    setSelectedBrands(updatedBrands);
    updateFilters({ brands: updatedBrands });
  };

  // Handle rating selection
  const handleRatingChange = (rating: number) => {
    setSelectedRatings(rating);
    updateFilters({ ratings: rating });
  };

  // Clear all filters
  const clearFilters = () => {
    setPriceRange([0, 1000]);
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedRatings(null);
    const clearedFilters = {};
    dispatch(setFilters(clearedFilters)); // Clear filters in Redux
    dispatch(fetchSearchResults({ query: "", page: 1, filters: clearedFilters }));

  };

  return (
    <StyledFilters>
      <FlexBox flexDirection="column" p="1rem" gap="1rem">
        {/* Price Range */}
        <Box>
          <h4>Price Range</h4>
          <Slider
            min={0}
            max={5000}
            step={50}
            value={priceRange}
            onChange={handlePriceChange}
            valueLabelDisplay="auto"
          />
          <p>
            ${priceRange[0]} - ${priceRange[1]}
          </p>
        </Box>

        {/* Categories */}
        <Box>
          <h4>Categories</h4>
          {categories.map((category) => (
            <CheckBox
              key={category}
              label={category}
              checked={selectedCategories.includes(category)}
              onChange={() => toggleCategory(category)}
            />
          ))}
        </Box>

        {/* Brands */}
        <Box>
          <h4>Brands</h4>
          {brands.map((brand) => (
            <CheckBox
              key={brand}
              label={brand}
              checked={selectedBrands.includes(brand)}
              onChange={() => toggleBrand(brand)}
            />
          ))}
        </Box>

        {/* Ratings */}
        <Box>
          <h4>Ratings</h4>
          {ratings.map((rating) => (
            <Button
              key={rating}
              variant={selectedRatings === rating ? "contained" : "outlined"}
              onClick={() => handleRatingChange(rating)}
            >
              {rating} Stars
            </Button>
          ))}
        </Box>

        {/* Clear Filters */}
        <Button variant="contained" color="secondary" onClick={clearFilters}>
          Clear All Filters
        </Button>
      </FlexBox>
    </StyledFilters>
  );
};

export default AdvancedSearchFilters;
