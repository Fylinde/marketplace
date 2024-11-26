import React from "react";
import styled from "styled-components";

// Define valid severity types
type Severity = "success" | "error" | "info" | "warning";

interface AlertProps {
    severity: Severity;
    message?: string; // Optional message
    children?: React.ReactNode; // Optional children
    dismissible?: boolean; // Whether the alert can be dismissed
    onClose?: () => void; // Callback for when the alert is dismissed
  }

  const alertColors: Record<Severity, { bg: string; color: string }> = {
    success: { bg: '#d4edda', color: '#155724' },
    error: { bg: '#f8d7da', color: '#721c24' },
    info: { bg: '#d1ecf1', color: '#0c5460' },
    warning: { bg: '#fff3cd', color: '#856404' },
  };

// Styled components
const AlertContainer = styled.div<{ severity: Severity }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-radius: 4px;
  background-color: ${(props) => alertColors[props.severity].bg};
  color: ${(props) => alertColors[props.severity].color};
  border: 1px solid ${(props) => alertColors[props.severity].color};
  position: relative;
  font-size: 14px;
  font-weight: 500;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 16px;
  color: inherit;
  cursor: pointer;
  padding: 0 8px;
  line-height: 1;
`;

const Alert: React.FC<AlertProps> = ({
  severity = 'info',
  message,
  children,
  dismissible = false,
  onClose,
}) => {
  return (
    <AlertContainer severity={severity} role="alert">
      <span>{message || children}</span>
      {dismissible && (
        <CloseButton aria-label="Close" onClick={onClose}>
          &times;
        </CloseButton>
      )}
    </AlertContainer>
  );
};

export default Alert;