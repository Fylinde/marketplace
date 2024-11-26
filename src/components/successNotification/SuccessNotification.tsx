// src/components/SuccessNotification.tsx
import React from "react";

interface Props {
  message: string;
}

const SuccessNotification: React.FC<Props> = ({ message }) => (
  <div className="success-notification">
    <p>Success: {message}</p>
  </div>
);

export default SuccessNotification;