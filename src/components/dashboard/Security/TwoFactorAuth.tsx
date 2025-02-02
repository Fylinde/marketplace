import React, { useEffect, useState } from "react";
import { Button, Input, Alert, Switch, Spin } from "antd";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTwoFactorStatus,
  enableTwoFactor,
  verifyTwoFactor,
} from "../../../redux/slices/security/securitySlice";
import { RootState, AppDispatch } from "../../../redux/store";
import { getLocalizedText } from "../../../utils/localizationUtils";

const TwoFactorContainer = styled.div`
  padding: 20px;
  max-width: 400px;
  margin: 0 auto;

  h2 {
    margin-bottom: 20px;
    font-size: 1.8rem;
  }

  .input-code {
    margin-bottom: 10px;
  }

  .alert {
    margin-top: 10px;
  }
`;

const TwoFactorAuth: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { twoFactorEnabled, loading, error } = useSelector((state: RootState) => state.security);

  const userId = useSelector((state: RootState) => state.auth?.userId);

  const [code, setCode] = useState("");

  useEffect(() => {
    if (userId) {
      dispatch(fetchTwoFactorStatus(userId)); // Pass `userId` to fetch the 2FA status
    }
  }, [dispatch, userId]);

  const handleEnable = async () => {
    try {
      if (userId) {
        await dispatch(enableTwoFactor(userId)).unwrap();
        alert(getLocalizedText("Two-Factor Authentication enabled!", "security"));
      }
    } catch {
      alert(getLocalizedText("Failed to enable Two-Factor Authentication.", "security"));
    }
  };

  const handleVerify = async () => {
    try {
      if (userId) {
        await dispatch(verifyTwoFactor({ userId, token: code })).unwrap();
        alert(getLocalizedText("Two-Factor Authentication verified!", "security"));
      }
    } catch {
      alert(getLocalizedText("Invalid verification code.", "security"));
    }
  };

  return (
    <TwoFactorContainer>
      <h2>{getLocalizedText("Two-Factor Authentication", "security")}</h2>
      {loading && <Spin tip={getLocalizedText("Loading...", "security")} />}
      {error && <Alert message={error} type="error" className="alert" />}
      {!loading && (
        <div>
          <p>
            {getLocalizedText(
              `Two-Factor Authentication is currently ${twoFactorEnabled ? "enabled" : "disabled"}.`,
              "security"
            )}
          </p>
          {twoFactorEnabled ? (
            <>
              <Input
                placeholder={getLocalizedText("Enter verification code", "security")}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="input-code"
              />
              <Button onClick={handleVerify} type="primary">
                {getLocalizedText("Verify", "security")}
              </Button>
            </>
          ) : (
            <Button onClick={handleEnable} type="primary">
              {getLocalizedText("Enable Two-Factor Authentication", "security")}
            </Button>
          )}
        </div>
      )}
    </TwoFactorContainer>
  );
};

export default TwoFactorAuth;
