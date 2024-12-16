import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
    updateFilters(state, action: PayloadAction<{ filterType: string; value: any }>) {
      const { filterType, value } = action.payload;
      state[filterType] = value;
    },
    clearFilters(state) {
      state.context = null;
      state.price = [0, 1000];
      state.availability = null;
      state.selectedCategories = [];
    },
    applyFilters(state, action: PayloadAction<ProductFilters>) {
      // Handle applying filters to the product list (e.g., API call or local filtering)
    },
  },
});

export const { updateFilters, clearFilters, applyFilters } = productFilterSlice.actions;

export default productFilterSlice.reducer;
