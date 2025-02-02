import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import rewardsService from "../../../services/rewardsService";

export interface Reward {
  id: string;
  type: "Points" | "Cashback" | "Voucher";
  value: number;
  currency: string;
}

interface RewardsState {
  rewards: Reward[];
  totalRewardsValue: number;
  loading: boolean;
  error: string | null;
}

const initialState: RewardsState = {
  rewards: [],
  totalRewardsValue: 0,
  loading: false,
  error: null,
};

// Async Thunks
export const fetchRewards = createAsyncThunk<Reward[]>(
  "rewards/fetchRewards",
  async (_, thunkAPI) => {
    try {
      return await rewardsService.getRewards();
    } catch (error: any) {
      return thunkAPI.rejectWithValue("Failed to fetch rewards.");
    }
  }
);

export const removeReward = createAsyncThunk<string, string>(
  "rewards/removeReward",
  async (rewardId, thunkAPI) => {
    try {
      await rewardsService.removeReward(rewardId);
      return rewardId;
    } catch (error: any) {
      return thunkAPI.rejectWithValue("Failed to remove reward.");
    }
  }
);

// Slice
const rewardsSlice = createSlice({
  name: "rewards",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRewards.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRewards.fulfilled, (state, action: PayloadAction<Reward[]>) => {
        state.loading = false;
        state.rewards = action.payload;
        state.totalRewardsValue = action.payload.reduce(
          (sum, reward) => sum + reward.value,
          0
        );
      })
      .addCase(fetchRewards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(removeReward.fulfilled, (state, action: PayloadAction<string>) => {
        state.rewards = state.rewards.filter((reward) => reward.id !== action.payload);
        state.totalRewardsValue = state.rewards.reduce(
          (sum, reward) => sum + reward.value,
          0
        );
      })
      .addCase(removeReward.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export default rewardsSlice.reducer;
