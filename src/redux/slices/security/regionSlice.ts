import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface RegionState {
  region: string; // Buyer's region
  locale: string; // Locale for formatting (e.g., "en-US")
  timezone: string; // Timezone information
}

const initialState: RegionState = {
  region: "US",
  locale: "en-US",
  timezone: "America/New_York",
};

const regionSlice = createSlice({
  name: "region",
  initialState,
  reducers: {
    setRegion(state, action: PayloadAction<string>) {
      state.region = action.payload;
    },
    setLocale(state, action: PayloadAction<string>) {
      state.locale = action.payload;
    },
    setTimezone(state, action: PayloadAction<string>) {
      state.timezone = action.payload;
    },
  },
});

export const { setRegion, setLocale, setTimezone } = regionSlice.actions;

export default regionSlice.reducer;
