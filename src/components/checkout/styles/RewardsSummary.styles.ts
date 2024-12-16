import styled from "styled-components";

export const RewardsContainer = styled.div`
  margin: 20px auto;
  max-width: 800px;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 15px;
  }
`;

export const RewardsTitle = styled.h3`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

export const RewardsList = styled.div`
  margin-top: 10px;

  .ant-list-item {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .ant-list-item-meta-title {
      font-size: 16px;
    }

    .ant-list-item-meta-description {
      font-size: 14px;
      color: #666;
    }
  }

  @media (max-width: 768px) {
    .ant-list-item {
      flex-direction: column;
      align-items: flex-start;

      .ant-list-item-actions {
        margin-top: 10px;
      }
    }
  }
`;

export const RewardsTotal = styled.p`
  margin-top: 20px;
  font-size: 16px;
  font-weight: bold;
  text-align: right;

  @media (max-width: 768px) {
    text-align: left;
  }
`;

export const RewardsAlert = styled.div`
  margin-bottom: 15px;
`;
