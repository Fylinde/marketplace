import React from "react";
import ReactSelect, { Theme, StylesConfig, SingleValue, MultiValue, ActionMeta } from "react-select";
import { SpaceProps } from "styled-system";
import { colors } from "../utils/themeColors";
import Box from "./Box";
import Typography from "./Typography";
import { SelectOption } from "../types/selectOption";


interface SelectProps extends SpaceProps {
  options: SelectOption[];
  value?: SingleValue<SelectOption> | MultiValue<SelectOption>;
  isMulti?: boolean; // Allow multi-select
  defaultValue?: SelectOption; // Default value for uncontrolled select
  id?: string; // ID for the select component
  label?: string; // Label above the select
  errorText?: string; // Error message text
  onChange?: (
    option: SingleValue<SelectOption> | MultiValue<SelectOption>,
    actionMeta: ActionMeta<SelectOption>
  ) => void;
  placeholder?: string;
  [key: string]: unknown; // Allow additional props dynamically
}

const Select: React.FC<SelectProps> = ({
  options,
  id,
  value,
  label,
  errorText,
  isMulti = false,
  onChange,
  placeholder = "Select an option",
  ...props
}) => {
  // Separate spacing props (margin and padding) and other props
  const spacingProps: Record<string, unknown> = {};
  const otherProps: Record<string, unknown> = {};

  Object.keys(props).forEach((key) => {
    if (key.startsWith("m") || key.startsWith("p")) {
      spacingProps[key] = props[key];
    } else {
      otherProps[key] = props[key];
    }
  });

  return (
    <Box {...spacingProps}>
      {/* Render label if provided */}
      {label && (
        <Typography fontSize="0.875rem" mb="6px" fontWeight="bold">
          {label}
        </Typography>
      )}

      {/* Render the react-select component */}
      <ReactSelect<SelectOption, boolean>
            id={id as string | undefined} // Ensure the id is cast to string | undefined
            options={options} // Options for the select dropdown
            placeholder={placeholder} // Placeholder text
            styles={customStyles} // Use the updated custom styles
            theme={(theme: Theme) => ({
              ...theme,
              colors: {
                ...theme.colors,
                primary: colors.primary.main, // Primary color for the theme
                primary50: colors.gray[100], // Highlight color for focused options
                neutral20: colors.text.disabled, // Border color
              },
            })}
            isMulti={isMulti} // Enable multi-select if specified
            value={
              props.isMulti
                ? (props.value as MultiValue<SelectOption>)
                : (props.value as SingleValue<SelectOption>)
            } // Handle value for single or multi-select
            onChange={(option, actionMeta) => {
              if (onChange) {
                onChange(option, actionMeta); // Pass the option to the parent handler
              }
            }}
            {...otherProps} // Pass any additional props dynamically
          />


      {/* Render error text if provided */}
      {errorText && (
        <Typography color="error.main" mt="0.5rem" fontSize="0.75rem">
          {errorText}
        </Typography>
      )}
    </Box>
  );
};

// Custom styles for react-select
const customStyles: StylesConfig<SelectOption, boolean> = {
  control: (styles) => ({
    ...styles,
    borderColor: colors.text.disabled, // Default border color
    "&:hover": { borderColor: colors.primary.main }, // Hover state
    boxShadow: "none", // Remove default focus shadow
    minHeight: "40px", // Height of the select control
  }),
  placeholder: (styles) => ({
    ...styles,
    color: colors.text.muted, // Muted placeholder color
  }),
  singleValue: (styles) => ({
    ...styles,
    color: colors.text.primary, // Text color for selected value
  }),
  menu: (styles) => ({
    ...styles,
    zIndex: 10, // Ensure dropdown appears above other elements
  }),
  option: (styles, { isFocused }) => ({
    ...styles,
    color: isFocused ? colors.primary.main : colors.text.primary, // Color on focus
    backgroundColor: isFocused ? colors.gray[100] : "transparent", // Background color on focus
    cursor: "pointer", // Pointer cursor
  }),
  input: (styles) => ({
    ...styles,
    height: "40px", // Consistent height
    color: colors.text.primary, // Input text color
  }),
};


export default Select;
