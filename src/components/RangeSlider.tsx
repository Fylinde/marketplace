import React from "react";

interface RangeSliderProps {
  min: number;
  max: number;
  value: number[]; // Array to hold min and max selected values
  onChange: (value: number[]) => void; // Callback to handle changes
  step?: number; // Optional step size
  label?: string[]; // Optional labels for min and max values
}

const RangeSlider: React.FC<RangeSliderProps> = ({
  min,
  max,
  value,
  onChange,
  step = 1,
  label = [`${min}`, `${max}`],
}) => {
  const handleMinChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Math.min(Number(event.target.value), value[1]);
    onChange([newValue, value[1]]);
  };

  const handleMaxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Math.max(Number(event.target.value), value[0]);
    onChange([value[0], newValue]);
  };

  return (
    <div style={{ width: "100%", padding: "10px 0" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>{label[0]}</span>
        <span>{label[1]}</span>
      </div>
      <div style={{ position: "relative", height: "40px" }}>
        <input
          type="range"
          min={min}
          max={max}
          value={value[0]}
          step={step}
          onChange={handleMinChange}
          style={{
            position: "absolute",
            zIndex: 1,
            width: "100%",
            pointerEvents: value[0] <= value[1] ? "auto" : "none",
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={value[1]}
          step={step}
          onChange={handleMaxChange}
          style={{
            position: "absolute",
            zIndex: 2,
            width: "100%",
            pointerEvents: value[0] <= value[1] ? "auto" : "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: `${((value[0] - min) / (max - min)) * 100}%`,
            right: `${100 - ((value[1] - min) / (max - min)) * 100}%`,
            height: "4px",
            background: "#007bff",
            zIndex: 0,
            transform: "translateY(-50%)",
          }}
        ></div>
      </div>
    </div>
  );
};

export default RangeSlider;
