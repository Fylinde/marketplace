import React from "react";
import AccessControl from "./AccessControl";
import TwoFactorAuth from "./TwoFactorAuth";

const Security: React.FC = () => {
  return (
    <div>
      <h1>Security Management</h1>
      {/* Access Control */}
      <AccessControl />

      {/* Two-Factor Authentication */}
      <TwoFactorAuth />
    </div>
  );
};

export default Security;
