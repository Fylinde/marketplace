import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Alert, Button, List } from "antd";
import { fetchRewards, removeReward } from "../../redux/slices/marketing/rewardsSlice";
import {
  RewardsContainer,
  RewardsTitle,
  RewardsList,
  RewardsTotal,
  RewardsAlert,
} from "./styles/RewardsSummary.styles";
import type { AppDispatch, RootState } from "../../redux/store";

const RewardsSummary: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { rewards, totalRewardsValue, error, loading } = useSelector(
    (state: RootState) => state.rewards
  );

  useEffect(() => {
    dispatch(fetchRewards());
  }, [dispatch]);

  const handleRemoveReward = (rewardId: string) => {
    dispatch(removeReward(rewardId));
  };

  return (
    <RewardsContainer>
      <RewardsTitle>Rewards Summary</RewardsTitle>

      {error && (
        <RewardsAlert>
          <Alert message={error} type="error" showIcon />
        </RewardsAlert>
      )}
      {loading && <p>Loading rewards...</p>}

      {rewards.length === 0 ? (
        <p>No rewards applied to this order.</p>
      ) : (
        <RewardsList>
          <List
            itemLayout="horizontal"
            dataSource={rewards}
            renderItem={(reward) => (
              <List.Item
                actions={[
                  <Button
                    type="link"
                    danger
                    onClick={() => handleRemoveReward(reward.id)}
                  >
                    Remove
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  title={`${reward.type} Reward`}
                  description={`Value: ${reward.value} ${reward.currency}`}
                />
              </List.Item>
            )}
          />
        </RewardsList>
      )}
      <RewardsTotal>
        Total Rewards Value: {totalRewardsValue} {rewards[0]?.currency || ""}
      </RewardsTotal>
    </RewardsContainer>
  );
};

export default RewardsSummary;
