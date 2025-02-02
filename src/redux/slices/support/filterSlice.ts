import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface FiltersState {
  filters: {
    context?: string;
    buyerPrice?: number[];
    sellerPrice?: number[];
    [key: string]: any;
  };
  category: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  brand: string | null;
  color: string | null;
  rating: number | null;
  sellerId?: string;
  priceRange?: [number, number];
  sort?: string; // Add the sort property here
  otherOptions: { [key: string]: boolean }; // Handles options like "On Sale", "In Stock"
}

const initialState: FiltersState = {
  filters: {
    context: '',
    buyerPrice: [],
    sellerPrice: [],
     key: [],
  },
  sellerId: undefined,
  priceRange: [0, 1000],
  sort: "popularity", // Default value
  category: null,
  minPrice: null,
  maxPrice: null,
  brand: null,
  color: null,
  rating: null,
  otherOptions: {
    onSale: false,
    inStock: false,
    featured: false,
  },
};

const filterSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    updateFilters: (state, action: PayloadAction<Partial<FiltersState>>) => {
      // Update the specific filter key(s) with the provided value(s)
      Object.assign(state, action.payload);
    },
    toggleOption: (state, action: PayloadAction<string>) => {
      // Toggle specific options like "On Sale", "In Stock"
      const optionKey = action.payload;
      if (state.otherOptions.hasOwnProperty(optionKey)) {
        state.otherOptions[optionKey] = !state.otherOptions[optionKey];
      }
    },
    resetFilters: () => initialState, // Reset filters to the initial state
  },
});

export const { updateFilters, toggleOption, resetFilters } = filterSlice.actions;

export default filterSlice.reducer;
