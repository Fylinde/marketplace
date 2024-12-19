import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WritableDraft } from "immer";

interface ProductFilters {
  context: "B2B" | "B2C" | "C2C" | null;
  buyerPrice: [number, number]; // Dual pricing: buyer price range
  sellerPrice: [number, number]; // Dual pricing: seller price range
  availability: "inStock" | "outOfStock" | null;
  selectedCategories: string[];
}

const initialState: ProductFilters = {
  context: null,
  buyerPrice: [0, 1000],
  sellerPrice: [0, 1000],
  availability: null,
  selectedCategories: [],
};

const productFilterSlice = createSlice({
  name: "productFilters",
  initialState,
  reducers: {
    updateFilters<K extends keyof ProductFilters>(
      state: WritableDraft<ProductFilters>, // Explicitly type the state
      action: PayloadAction<{ filterType: K; value: ProductFilters[K] }>
    ) {
      const { filterType, value } = action.payload;
      state[filterType] = value; // Type-safe access
    },
    clearFilters(state: WritableDraft<ProductFilters>) {
      state.context = null;
      state.buyerPrice = [0, 1000];
      state.sellerPrice = [0, 1000];
      state.availability = null;
      state.selectedCategories = [];
    },
    applyFilters(
      state: WritableDraft<ProductFilters>,
      action: PayloadAction<ProductFilters>
    ) {
      // Handle applying filters
    },
  },
});

export const { updateFilters, clearFilters, applyFilters } = productFilterSlice.actions;

export default productFilterSlice.reducer;
