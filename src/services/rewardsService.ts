import axios from "axios";
import { Reward } from "../redux/slices/marketing/rewardsSlice";

const rewardsService = {
  async getRewards(): Promise<Reward[]> {
    const response = await axios.get("/api/rewards");
    return response.data;
  },

  async removeReward(rewardId: string): Promise<void> {
    await axios.delete(`/api/rewards/${rewardId}`);
  },
};

export default rewardsService;
