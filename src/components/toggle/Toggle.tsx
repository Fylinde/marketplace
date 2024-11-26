import React from "react";

interface ToggleProps {
  isChecked: boolean;
  onChange: () => void;
  label?: string;
}

const Toggle: React.FC<ToggleProps> = ({ isChecked, onChange, label }) => {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      {label && <span>{label}</span>}
      <label style={{ position: "relative", display: "inline-block", width: "40px", height: "20px" }}>
        <input
          type="checkbox"
          checked={isChecked}
          onChange={onChange}
          style={{ opacity: 0, width: 0, height: 0 }}
        />
        <span
          style={{
            position: "absolute",
            cursor: "pointer",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: isChecked ? "#4caf50" : "#ccc",
            transition: ".4s",
            borderRadius: "20px",
          }}
        ></span>
        <span
          style={{
            position: "absolute",
            height: "14px",
            width: "14px",
            left: isChecked ? "22px" : "4px",
            bottom: "3px",
            backgroundColor: "white",
            borderRadius: "50%",
            transition: ".4s",
          }}
        ></span>
      </label>
    </div>
  );
};

export default Toggle;
