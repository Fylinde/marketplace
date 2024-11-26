// src/components/ErrorNotification.tsx
import React from "react";

interface Props {
  message: string;
}

const ErrorNotification: React.FC<Props> = ({ message }) => (
  <div className="error-notification">
    <p>Error: {message}</p>
  </div>
);

export default ErrorNotification;