import React from "react";
import ReactSelect, { SingleValue, ActionMeta, StylesConfig } from "react-select";
import { SelectOption } from "../types/selectOption";
import Typography from "../components/Typography";

interface SingleSelectProps {
  options: SelectOption[]; // The options for the select dropdown
  value: SingleValue<SelectOption>; // Selected value
  onChange: (value: SingleValue<SelectOption>, actionMeta: ActionMeta<SelectOption>) => void; // Change handler
  placeholder?: string; // Placeholder text
  label?: string; // Label text for the select
}

const customStyles: StylesConfig<SelectOption, false> = {
  control: (styles) => ({
    ...styles,
    borderColor: "#ccc",
    "&:hover": { borderColor: "#888" },
    boxShadow: "none",
  }),
  singleValue: (styles) => ({
    ...styles,
    color: "#333",
  }),
};

const SingleSelect: React.FC<SingleSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  label,
}) => {
  return (
    <div>
      {/* Render label if provided */}
      {label && (
        <Typography fontSize="0.875rem" mb="6px" fontWeight="bold">
          {label}
        </Typography>
      )}
      {/* Render the ReactSelect component */}
      <ReactSelect<SelectOption, false>
        options={options}
        value={value}
        onChange={onChange}
        isMulti={false} // Single-select mode enforced
        styles={customStyles}
        placeholder={placeholder}
      />
    </div>
  );
};

export default SingleSelect;
