import styled from "styled-components";
import Button from "../../../components/buttons/Button";
import Input from "../../../components/input/Input";

export const PromoContainer = styled.div`
  margin: 20px auto;
  max-width: 600px;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 15px;
  }
`;

export const PromoText = styled.p`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

export const PromoAlert = styled.div`
  margin-bottom: 10px;
`;

export const PromoForm = styled.div`
  margin-top: 10px;

  .ant-form-inline {
    display: flex;
    gap: 10px;

    @media (max-width: 768px) {
      flex-direction: column;

      .ant-form-item {
        width: 100%;
      }
    }
  }
`;

// Enhance PromoInput to properly forward props like `disabled`
export const PromoInput = styled(Input).attrs((props) => ({
  ...props, // Ensure all props are forwarded, including `disabled`
}))`
  width: 300px;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

// Enhance PromoButton to properly forward `loading` and other props
export const PromoButton = styled(Button).attrs((props) => ({
  ...props, // Ensure all props are forwarded, including `loading`
}))`
  font-size: 16px;
  padding: 8px 16px;

  @media (max-width: 768px) {
    width: 100%;
    padding: 10px;
  }
`;
