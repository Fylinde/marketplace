// marketSlice.ts
import { createSlice } from "@reduxjs/toolkit";

interface MarketState {
  buyerId: string;
  region: string;
  season: string;
  targetAudience: string;
}

const initialState: MarketState = {
  buyerId: "",
  region: "",
  season: "",
  targetAudience: "",
};

const marketSlice = createSlice({
  name: "market",
  initialState,
  reducers: {
    setBuyerId(state, action) {
      state.buyerId = action.payload;
    },
    setRegion(state, action) {
      state.region = action.payload;
    },
    setSeason(state, action) {
      state.season = action.payload;
    },
    setTargetAudience(state, action) {
      state.targetAudience = action.payload;
    },
  },
});

export const { setBuyerId, setRegion, setSeason, setTargetAudience } = marketSlice.actions;

export default marketSlice.reducer;
